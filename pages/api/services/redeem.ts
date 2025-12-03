
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { code, userId } = req.body as { code: string; userId?: string };
  const db = await getDb();

  const redeem = await db.collection("redeemCodes").findOne({ code, used: false });
  if (!redeem) return res.status(400).json({ error: "Invalid or used code" });

  await db.collection("redeemCodes").updateOne(
    { _id: redeem._id },
    { $set: { used: true, usedAt: new Date(), usedBy: userId ?? "unknown" } }
  );

  // TODO: extend / create services based on code metadata.
  return res.status(200).json({ ok: true });
}
