
import type { NextApiRequest, NextApiResponse } from "next";
import { handleOxapayWebhookRaw } from "../../../lib/oxapay";
import { autoDeployService } from "../../../lib/pterodactyl";
import { sendDiscordWebhook } from "../../../lib/discord";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks).toString("utf8");

  try {
    const order: any = await handleOxapayWebhookRaw(rawBody, req.headers);
    if (!order) {
      res.status(200).send("ok");
      return;
    }

    const serviceId = await autoDeployService({
      userId: order.userId,
      serviceType: order.serviceType,
      location: order.location,
      planId: order.planId,
      source: "PAYMENT"
    });

    await sendDiscordWebhook({
      title: "New paid order",
      description: `User ${order.userId} paid for ${order.serviceType} (${order.planId}), service ${serviceId}`
    });

    res.status(200).send("ok");
  } catch (err: any) {
    console.error("OxaPay webhook error:", err);
    res.status(400).send("error");
  }
}
