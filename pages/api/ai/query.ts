
import type { NextApiRequest, NextApiResponse } from "next";
import { callAunuSpaceAI } from "../../../lib/ai";
import { Role } from "../../../lib/roles";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { message, role } = req.body as { message: string; role: Role };
  const reply = await callAunuSpaceAI(message, role);
  res.status(200).json(reply);
}
