
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, email, password } = req.body as {
    username: string;
    email: string;
    password: string;
  };

  const db = await getDb();
  const existing = await db.collection("users").findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already used" });

  const hash = await bcrypt.hash(password, 10);

  const user = await db.collection("users").insertOne({
    username,
    email,
    password: hash,
    role: "CUSTOMER",
    createdAt: new Date()
  });

  // TODO: Create session / JWT
  return res.status(200).json({ ok: true, userId: user.insertedId });
}
