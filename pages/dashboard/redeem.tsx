
import Layout from "../../components/Layout";
import { FormEvent, useState } from "react";

export default function RedeemPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const code = (form.elements.namedItem("code") as HTMLInputElement).value;
    // TODO: Replace userId with real authenticated user id
    const userId = "demo-user-id";
    const res = await fetch("/api/redeem/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, userId })
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus(json.error || "Failed to redeem code");
    } else {
      setStatus("Code redeemed successfully!");
    }
  }

  return (
    <Layout>
      <h1 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>Redeem Code</h1>
      <p style={{ fontSize: "0.9rem", color: "#9ca3af", maxWidth: 520 }}>
        Enter your redeem code. Codes can give you website balance in USD, or automatically
        create hosting services (Minecraft / Bot) on random nodes at the location set by admin.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "1rem", maxWidth: 360 }}
      >
        <input
          name="code"
          className="input-dark"
          placeholder="AUNU_XXXX_XXXX"
          required
        />
        <button type="submit" className="btn-neon" style={{ width: "100%", marginTop: "0.9rem" }}>
          Redeem
        </button>
      </form>

      {status && (
        <p style={{ marginTop: "0.7rem", fontSize: "0.85rem", color: "#e5e7eb" }}>
          {status}
        </p>
      )}
    </Layout>
  );
}
