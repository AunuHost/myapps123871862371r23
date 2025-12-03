
import { useEffect, useState } from "react";
import Link from "next/link";

const taglines = [
  "Deploy high performance NVMe VPS in seconds.",
  "Host Minecraft & bot instances with ultra-low latency.",
  "Crypto-ready billing powered by Oxapay.",
  "Automated Pterodactyl provisioning on random nodes."
];

export default function HeroAurora() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % taglines.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ position: "relative", marginTop: "1.5rem" }}>
      <div className="hero-grid" style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      <div
        className="glass-card glass-card-floating"
        style={{
          padding: "2rem 2rem 2.2rem",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: "1.7rem"
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.8rem",
              padding: "0.25rem 0.7rem",
              borderRadius: "999px",
              border: "1px solid rgba(56,189,248,0.6)",
              color: "#e0f2fe",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle, #22c55e, #22c55e 60%, transparent 65%)",
                boxShadow: "0 0 12px rgba(34,197,94,1)"
              }}
            />
            Realtime auto-deploy infrastructure
          </span>
          <h1
            style={{
              marginTop: "1.1rem",
              fontSize: "clamp(2.1rem, 3vw + 1rem, 3.3rem)",
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "0.02em"
            }}
          >
            Dark-themed Cloud for
            <span
              style={{
                background:
                  "linear-gradient(to right, #22d3ee, #a855f7, #f97316)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              {" "}
              Gamers & Developers.
            </span>
          </h1>
          <p className="hero-tagline">{taglines[index]}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#9ca3af" }}>
            AunuCloud brings automated VPS, Minecraft and bot hosting with crypto payments,
            Discord notifications, and AunuSpace AI at your side.
          </p>
          <div style={{ marginTop: "1.3rem", display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
            <Link href="/auth/register" className="btn-neon">
              Launch your node
            </Link>
            <Link href="/hosting/vps" className="btn-neon-outline">
              View VPS plans
            </Link>
          </div>
        </div>

        <div className="floating glass-card" style={{ padding: "1.3rem 1.4rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.7rem" }}>Live Cloud Snapshot</h3>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.7rem" }}>
            Randomized node & region selection for new deployments.
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "0.9rem",
              fontSize: "0.8rem"
            }}
          >
            <div>
              <div style={{ color: "#9ca3af" }}>Active Services</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>128</div>
            </div>
            <div>
              <div style={{ color: "#9ca3af" }}>Regions</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>3</div>
            </div>
            <div>
              <div style={{ color: "#9ca3af" }}>Avg Uptime</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>99.99%</div>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px dashed rgba(148,163,184,0.5)",
              margin: "0.9rem 0"
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge-role badge-role-owner">Owner / AunuXdev</span>
            <span className="badge-role badge-role-developer">Developer / AunuXdev</span>
            <span className="badge-role badge-role-member">Member tier AI-limited</span>
          </div>
        </div>
      </div>
    </section>
  );
}
