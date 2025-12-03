
import { FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Role } from "../../lib/roles";

interface RedeemCode {
  id: string;
  code: string;
  type: "BALANCE" | "MINECRAFT" | "BOT" | "VPS";
  maxClaims: number;
  claims: { userId: string; claimedAt: string }[];
  balanceAmountUsd?: number | null;
  hostingKind?: string | null;
  eggId?: string | null;
  cpuPercent?: number | null;
  ramMb?: number | null;
  diskMb?: number | null;
  locationId?: number | null;
  createdAt?: string;
}

export default function AdminRedeemPage() {
  const [role] = useState<Role>("OWNER");
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/redeem/list");
        const json = await res.json();
        setCodes(json.codes ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (role !== "OWNER" && role !== "DEVELOPER" && role !== "ADMIN") {
    return (
      <Layout>
        <h1>Admin Redeem</h1>
        <p style={{ color: "#fca5a5", fontSize: "0.9rem" }}>
          You must be Owner / Developer / Admin to view this page.
        </p>
      </Layout>
    );
  }

  async function handleGenerate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const type = formData.get("type") as string;

    const payload: any = {
      code: (formData.get("code") as string) || "",
      type,
      maxClaims: Number(formData.get("maxClaims") || 1)
    };

    if (type === "BALANCE") {
      payload.balanceAmountUsd = Number(formData.get("balanceAmountUsd") || 0);
    } else {
      payload.cpuPercent = formData.get("cpuPercent") || null;
      payload.ramMb = formData.get("ramMb") || null;
      payload.diskMb = formData.get("diskMb") || null;
      payload.locationId = formData.get("locationId") || null;
      payload.eggId = formData.get("eggId") || null;
      payload.hostingKind = formData.get("hostingKind") || null;
    }

    setCreating(true);
    setCreateStatus(null);
    try {
      const res = await fetch("/api/redeem/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        setCreateStatus(json.error || "Failed to generate code");
      } else {
        setCreateStatus(`Code generated: ${json.code}`);
        // refresh list
        const listRes = await fetch("/api/redeem/list");
        const listJson = await listRes.json();
        setCodes(listJson.codes ?? []);
        form.reset();
      }
    } catch (err) {
      console.error(err);
      setCreateStatus("Failed to generate code");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Layout>
      <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Admin – Redeem codes</h1>
      <p style={{ fontSize: "0.9rem", color: "#9ca3af", maxWidth: 620, marginBottom: "1.1rem" }}>
        Generate AUNU_XXXX_XXXX codes that can add balance in USD or auto-create hosting
        services (Minecraft / Bot). For hosting, the server will be deployed on a random
        node in the Pterodactyl location ID you specify.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.2fr)",
          gap: "1.5rem",
          alignItems: "flex-start"
        }}
      >
        {/* Generator form */}
        <form
          onSubmit={handleGenerate}
          className="glass-card glass-card-floating"
          style={{ padding: "1.4rem" }}
        >
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>Generate code</h2>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.7rem" }}>
            Leave code empty to auto-generate one like <code>AUNU_ABCD_1234</code>.
          </p>

          <div style={{ marginBottom: "0.7rem" }}>
            <label style={{ fontSize: "0.8rem" }}>Code (optional)</label>
            <input name="code" className="input-dark" placeholder="AUNU_XXXX_XXXX" />
          </div>

          <div style={{ marginBottom: "0.7rem" }}>
            <label style={{ fontSize: "0.8rem" }}>Type</label>
            <select name="type" className="input-dark">
              <option value="BALANCE">Balance (USD)</option>
              <option value="MINECRAFT">Minecraft Hosting</option>
              <option value="BOT">Bot Hosting</option>
              <option value="VPS">VPS (Coming soon)</option>
            </select>
          </div>

          <div style={{ marginBottom: "0.7rem" }}>
            <label style={{ fontSize: "0.8rem" }}>Max uses</label>
            <select name="maxClaims" className="input-dark" defaultValue="1">
              {[1, 2, 3, 4, 5, 10, 20, 25].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "user" : "users"}
                </option>
              ))}
            </select>
          </div>

          {/* Balance-specific */}
          <div style={{ marginBottom: "0.7rem" }}>
            <label style={{ fontSize: "0.8rem" }}>Balance amount (USD) – if type = BALANCE</label>
            <input
              name="balanceAmountUsd"
              className="input-dark"
              placeholder="10"
              type="number"
              step="0.01"
            />
          </div>

          {/* Hosting-specific */}
          <div
            style={{
              marginTop: "0.9rem",
              paddingTop: "0.8rem",
              borderTop: "1px dashed rgba(148,163,184,0.5)"
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.4rem" }}>
              Hosting specs for Minecraft / Bot / VPS:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "0.6rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem" }}>CPU %</label>
                <input name="cpuPercent" className="input-dark" placeholder="100" />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem" }}>RAM (MB)</label>
                <input name="ramMb" className="input-dark" placeholder="4096" />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem" }}>Disk (MB)</label>
                <input name="diskMb" className="input-dark" placeholder="30000" />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem" }}>Location ID (Pterodactyl)</label>
                <input name="locationId" className="input-dark" placeholder="1" />
              </div>
            </div>

            <div style={{ marginTop: "0.6rem" }}>
              <label style={{ fontSize: "0.8rem" }}>Egg ID (from Pterodactyl)</label>
              <input
                name="eggId"
                className="input-dark"
                placeholder="e.g. 12 (Paper), 13 (Spigot)..."
              />
            </div>
            <div style={{ marginTop: "0.6rem" }}>
              <label style={{ fontSize: "0.8rem" }}>
                Hosting flavor (Minecraft: Paper/Spigot/etc, Bot: Node/Python/etc)
              </label>
              <input
                name="hostingKind"
                className="input-dark"
                placeholder="Paper / Spigot / NodeJS / Python ..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-neon"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={creating}
          >
            {creating ? "Generating..." : "Generate code"}
          </button>
          {createStatus && (
            <p style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#e5e7eb" }}>
              {createStatus}
            </p>
          )}
        </form>

        {/* List of codes & claims */}
        <div className="glass-card glass-card-floating" style={{ padding: "1.4rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>Existing codes</h2>
          {loading ? (
            <p style={{ fontSize: "0.85rem" }}>Loading...</p>
          ) : codes.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>No codes yet.</p>
          ) : (
            <div style={{ maxHeight: "420px", overflowY: "auto" }}>
              {codes.map((c) => (
                <div
                  key={String(c.id)}
                  style={{
                    padding: "0.7rem 0",
                    borderBottom: "1px solid rgba(15,23,42,0.9)",
                    fontSize: "0.8rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                    <span>
                      <strong>{c.code}</strong> • {c.type}
                    </span>
                    <span>
                      {c.claims.length}/{c.maxClaims} used
                    </span>
                  </div>
                  {c.type === "BALANCE" && (
                    <div style={{ color: "#9ca3af", marginTop: "0.2rem" }}>
                      +${c.balanceAmountUsd?.toFixed(2) ?? "0.00"} balance
                    </div>
                  )}
                  {c.type !== "BALANCE" && (
                    <div style={{ color: "#9ca3af", marginTop: "0.2rem" }}>
                      {c.hostingKind && <span>{c.hostingKind} • </span>}
                      {c.ramMb && <span>{c.ramMb}MB RAM • </span>}
                      {c.diskMb && <span>{c.diskMb}MB Disk • </span>}
                      {c.cpuPercent && <span>{c.cpuPercent}% CPU • </span>}
                      {c.locationId != null && <span>Loc ID: {c.locationId}</span>}
                    </div>
                  )}
                  {c.claims.length > 0 && (
                    <div style={{ marginTop: "0.25rem", color: "#6b7280" }}>
                      Claimed by:{" "}
                      {c.claims.map((cl) => cl.userId).join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
