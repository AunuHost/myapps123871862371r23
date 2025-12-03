
import type { NextApiRequest } from "next";
import { getDb } from "./db";

const OXAPAY_API_KEY = process.env.OXAPAY_API_KEY || "";
const OXAPAY_BASE_URL = process.env.OXAPAY_BASE_URL || "https://api.oxapay.com/v1";

/**
 * Create an invoice with OxaPay and store a pending order in MongoDB.
 * Docs: https://docs.oxapay.com/api-reference/payment/generate-invoice
 */
export async function createOxapayInvoice(payload: {
  userId: string;
  amountUsd: number;
  serviceType: "VPS" | "MC" | "BOT";
  planId: string;
  location: string;
}) {
  if (!OXAPAY_API_KEY) {
    throw new Error("OXAPAY_API_KEY is not configured");
  }

  const db = await getDb();

  // 1) Create local pending order
  const { insertedId } = await db.collection("orders").insertOne({
    ...payload,
    status: "PENDING",
    createdAt: new Date()
  });

  // 2) Call OxaPay "Generate Invoice" endpoint
  const callbackUrl =
    process.env.OXAPAY_CALLBACK_URL ||
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/payments/webhook`;

  const returnUrl =
    process.env.OXAPAY_RETURN_URL ||
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/dashboard`;

  const body = {
    amount: payload.amountUsd,
    currency: "USD",
    lifetime: 60,
    fee_paid_by_payer: 1,
    under_paid_coverage: 0,
    callback_url: callbackUrl,
    return_url: returnUrl,
    order_id: insertedId.toString(),
    description: `${payload.serviceType} :: ${payload.planId} :: ${payload.location}`,
    sandbox: process.env.OXAPAY_SANDBOX === "true"
  };

  const res = await fetch(`${OXAPAY_BASE_URL}/payment/invoice`, {
    method: "POST",
    headers: {
      "merchant_api_key": OXAPAY_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("OxaPay invoice error", res.status, text);
    throw new Error("Failed to create OxaPay invoice");
  }

  const json: any = await res.json();
  const paymentData = json?.data ?? {};

  // 3) Store track_id + payment_url on order document
  await db.collection("orders").updateOne(
    { _id: insertedId },
    {
      $set: {
        oxapayTrackId: paymentData.track_id,
        oxapayPaymentUrl: paymentData.payment_url,
        oxapayRaw: json
      }
    }
  );

  return {
    orderId: insertedId.toString(),
    trackId: paymentData.track_id,
    payUrl: paymentData.payment_url
  };
}

/**
 * Handle OxaPay webhook:
 * - verify HMAC signature
 * - mark order as paid
 * The Next.js API route should pass rawBody + headers to this helper.
 */
export async function handleOxapayWebhookRaw(rawBody: string, headers: { [key: string]: any }) {
  if (!OXAPAY_API_KEY) {
    throw new Error("OXAPAY_API_KEY is not configured");
  }

  const hmacHeader = headers["hmac"] || headers["HMAC"] || headers["Hmac"];
  if (!hmacHeader) {
    throw new Error("Missing HMAC header");
  }

  const crypto = await import("crypto");
  const calculated = crypto
    .createHmac("sha512", OXAPAY_API_KEY)
    .update(rawBody)
    .digest("hex");

  if (calculated !== hmacHeader) {
    throw new Error("Invalid HMAC signature");
  }

  const data = JSON.parse(rawBody);

  // We only care when status === "Paid" and type === "invoice"
  if (data.type !== "invoice" || (data.status || "").toLowerCase() !== "paid") {
    return null;
  }

  const orderId = data.order_id;
  if (!orderId) {
    throw new Error("Missing order_id in webhook payload");
  }

  const db = await getDb();
  const order = await db.collection("orders").findOne({ _id: new (await import("mongodb")).ObjectId(orderId) });

  if (!order) return null;

  await db.collection("orders").updateOne(
    { _id: order._id },
    {
      $set: {
        status: "PAID",
        paidAt: new Date(),
        webhookPayload: data
      }
    }
  );

  return order;
}
