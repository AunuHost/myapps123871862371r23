
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";
import { autoDeployService } from "../../../lib/pterodactyl";

/**
 * User redeem endpoint.
 * Body: { code: string, userId: string }
 * NOTE: In a real app you would take userId from the authenticated session, not body.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { code, userId } = req.body as { code: string; userId?: string };
    if (!code || !userId) {
      return res.status(400).json({ error: "Missing code or userId" });
    }

    const db = await getDb();
    const redeem = await db.collection("redeemCodes").findOne({ code });
    if (!redeem) {
      return res.status(400).json({ error: "Invalid code" });
    }

    const maxClaims = redeem.maxClaims || 1;
    const claims = redeem.claims || [];
    if (claims.length >= maxClaims) {
      return res.status(400).json({ error: "Code has reached maximum uses" });
    }

    if (claims.some((c: any) => c.userId === userId)) {
      return res.status(400).json({ error: "You already used this code" });
    }

    // Apply reward
    if (redeem.type === "BALANCE") {
      const amount = redeem.balanceAmountUsd || 0;
      await db.collection("users").updateOne(
        { _id: new (await import("mongodb")).ObjectId(userId) },
        { $inc: { balance: amount } }
      );
    } else if (redeem.type === "MINECRAFT" || redeem.type === "BOT") {
      // Auto-deploy hosting via Pterodactyl helper (stub)
      await autoDeployService({
        userId,
        serviceType: redeem.type === "MINECRAFT" ? "MC" : "BOT",
        locationId: redeem.locationId ?? null,
        ramMb: redeem.ramMb ?? null,
        diskMb: redeem.diskMb ?? null,
        cpuPercent: redeem.cpuPercent ?? null,
        eggId: redeem.eggId ?? null,
        flavor: redeem.hostingKind ?? null,
        source: "REDEEM_CODE"
      });
    } else if (redeem.type === "VPS") {
      // Coming soon: mark as reserved so user can later convert to real VPS.
      await db.collection("vpsReservations").insertOne({
        userId,
        redeemCode: redeem.code,
        createdAt: new Date()
      });
    }

    // Append claim
    await db.collection("redeemCodes").updateOne(
      { _id: redeem._id },
      {
        $push: {
          claims: {
            userId,
            claimedAt: new Date()
          }
        }
      }
    );

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("redeem/claim error", e);
    res.status(500).json({ error: "Failed to redeem code" });
  }
}
