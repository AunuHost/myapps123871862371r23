
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body as { email: string; password: string };

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  // TODO: issue session / JWT cookie
  return res.status(200).json({ ok: true, userId: user._id, role: user.role });
}
