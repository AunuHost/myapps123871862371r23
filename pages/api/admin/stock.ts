
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";

/**
 * Simple stock endpoint for admin dashboard.
 * We expect a `plans` collection with documents like:
 * { type: "VPS" | "MC" | "BOT", planId: "VPS-1", name: "VPS-1", stock: 3 }
 *
 * TODO: add mutations so admin can update stock.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const db = await getDb();
    const plans = await db
      .collection("plans")
      .find({})
      .sort({ type: 1, planId: 1 })
      .toArray();

    res.status(200).json({
      plans: plans.map((p) => ({
        id: p._id,
        type: p.type,
        planId: p.planId,
        name: p.name,
        stock: p.stock ?? 0
      }))
    });
  } catch (e: any) {
    console.error("admin/stock error", e);
    res.status(500).json({ error: "Failed to load stock" });
  }
}
