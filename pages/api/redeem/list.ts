
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";

/**
 * Admin-only: list redeem codes and claims.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const db = await getDb();
    const codes = await db
      .collection("redeemCodes")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    res.status(200).json({
      codes: codes.map((c: any) => ({
        id: c._id,
        code: c.code,
        type: c.type,
        maxClaims: c.maxClaims,
        claims: c.claims || [],
        balanceAmountUsd: c.balanceAmountUsd ?? null,
        hostingKind: c.hostingKind ?? null,
        eggId: c.eggId ?? null,
        cpuPercent: c.cpuPercent ?? null,
        ramMb: c.ramMb ?? null,
        diskMb: c.diskMb ?? null,
        locationId: c.locationId ?? null,
        createdAt: c.createdAt
      }))
    });
  } catch (e: any) {
    console.error("redeem/list error", e);
    res.status(500).json({ error: "Failed to list codes" });
  }
}
