
import { Role, canUseUnlimitedAI } from "./roles";

const AUNUSPACE_API_KEY = process.env.AUNUSPACE_API_KEY || "";
const AUNUSPACE_BASE_URL =
  process.env.AUNUSPACE_BASE_URL || "https://api.example.com/aunuspace/chat";

/**
 * Very small proxy helper to call your AunuSpace AI backend.
 *
 * You should replace AUNUSPACE_BASE_URL with the real endpoint of your AI service.
 * This helper demonstrates how to:
 *  - forward role information
 *  - potentially limit usage for Member / Customer
 */
export async function callAunuSpaceAI(input: string, role: Role) {
  if (!AUNUSPACE_API_KEY) {
    return { reply: "AUNUSPACE_API_KEY is not configured on the server." };
  }

  // TODO: implement quotas per role using MongoDB (not in this demo)
  const limited = !canUseUnlimitedAI(role);

  const res = await fetch(AUNUSPACE_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUNUSPACE_API_KEY}`
    },
    body: JSON.stringify({
      message: input,
      role,
      limited
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("AunuSpace AI error", res.status, text);
    return { reply: "AunuSpace AI request failed." };
  }

  const data = await res.json();
  return data;
}
