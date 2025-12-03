
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";

/**
 * List latest orders for the admin dashboard.
 * TODO: add authentication & role check (Owner / Developer / Admin only).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const db = await getDb();
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    res.status(200).json({
      orders: orders.map((o) => ({
        id: o._id,
        userId: o.userId,
        serviceType: o.serviceType,
        planId: o.planId,
        location: o.location,
        status: o.status,
        amountUsd: o.amountUsd,
        createdAt: o.createdAt,
        paidAt: o.paidAt
      }))
    });
  } catch (e: any) {
    console.error("admin/orders error", e);
    res.status(500).json({ error: "Failed to load orders" });
  }
}
