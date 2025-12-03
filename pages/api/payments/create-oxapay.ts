
import type { NextApiRequest, NextApiResponse } from "next";
import { createOxapayInvoice } from "../../../lib/oxapay";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { userId, planId, amountUsd, serviceType, location } = req.body as {
      userId: string;
      planId: string;
      amountUsd: number;
      serviceType: "VPS" | "MC" | "BOT";
      location: string;
    };

    const invoice = await createOxapayInvoice({
      userId,
      planId,
      amountUsd,
      serviceType,
      location
    });
    res.status(200).json(invoice);
  } catch (e: any) {
    console.error("create-oxapay error", e);
    res.status(500).json({ error: "Failed to create invoice" });
  }
}
