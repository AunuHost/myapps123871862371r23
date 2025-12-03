
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";

/**
 * Admin-only: generate a redeem code.
 * NOTE: In a real app you must check that the caller is OWNER / DEVELOPER / ADMIN.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const {
      code,
      type,
      maxClaims,
      balanceAmountUsd,
      cpuPercent,
      ramMb,
      diskMb,
      locationId,
      eggId,
      flavor,
      hostingKind
    } = req.body as any;

    const db = await getDb();

    const allowedTypes = ["BALANCE", "MINECRAFT", "BOT", "VPS"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    const allowedClaims = [1, 2, 3, 4, 5, 10, 20, 25];
    if (!allowedClaims.includes(Number(maxClaims))) {
      return res.status(400).json({ error: "Invalid maxClaims" });
    }

    // Generate code if not provided
    let finalCode = String(code || "").trim();
    if (!finalCode) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const randomChunk = (len: number) =>
        Array.from({ length: len })
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("");
      finalCode = `AUNU_${randomChunk(4)}_${randomChunk(4)}`;
    }
    if (!finalCode.startsWith("AUNU_")) {
      return res.status(400).json({ error: "Code must start with AUNU_" });
    }

    const exists = await db.collection("redeemCodes").findOne({ code: finalCode });
    if (exists) {
      return res.status(400).json({ error: "Code already exists" });
    }

    const doc: any = {
      code: finalCode,
      type,
      maxClaims: Number(maxClaims),
      claims: [],
      createdAt: new Date(),
      hostingKind: hostingKind || null, // "Paper", "Spigot", etc
      eggId: eggId || null,
      cpuPercent: cpuPercent != null ? Number(cpuPercent) : null,
      ramMb: ramMb != null ? Number(ramMb) : null,
      diskMb: diskMb != null ? Number(diskMb) : null,
      locationId: locationId != null ? Number(locationId) : null
    };

    if (type === "BALANCE") {
      doc.balanceAmountUsd = Number(balanceAmountUsd || 0);
    }

    await db.collection("redeemCodes").insertOne(doc);

    res.status(200).json({ ok: true, code: finalCode });
  } catch (e: any) {
    console.error("redeem/generate error", e);
    res.status(500).json({ error: "Failed to generate code" });
  }
}
