
import Layout from "../components/Layout";
import HeroAurora from "../components/HeroAurora";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <HeroAurora />

      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Core AunuCloud stack</h2>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af", maxWidth: 520 }}>
          All services are backed by NVMe storage, automatic panel deployment, and instant
          crypto payments through Oxapay.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "1.4rem",
            marginTop: "1.4rem"
          }}
        >
          {[
            {
              title: "NVMe Cloud VPS",
              desc: "KVM virtualization, Gen4 NVMe, random node selection and anti-DDoS.",
              href: "/hosting/vps"
            },
            {
              title: "Minecraft Hosting",
              desc: "Paper, Purpur, Bungee, with panel auto-deploy and backups.",
              href: "/hosting/minecraft"
            },
            {
              title: "Bot Hosting",
              desc: "Discord & Telegram bots running on isolated containers.",
              href: "/hosting/bot"
            }
          ].map((card) => (
            <div key={card.title} className="glass-card glass-card-floating" style={{ padding: "1.4rem 1.5rem" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.3rem" }}>{card.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "0.9rem" }}>
                {card.desc}
              </p>
              <Link href={card.href} className="btn-neon-outline">
                View plans
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>
        <div className="glass-card glass-card-floating" style={{ padding: "1.5rem 1.7rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>AunuSpace AI</h2>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af", maxWidth: 520 }}>
            Your integrated assistant for deployment, troubleshooting and billing questions.
            Access level is based on your role: Member, Customer, Admin, Developer, or Owner.
          </p>
          <ul style={{ marginTop: "0.8rem", fontSize: "0.85rem", color: "#9ca3af" }}>
            <li>Members: limited prompts, restricted advanced actions.</li>
            <li>Customers: higher limits, can ask billing and deployment questions.</li>
            <li>Admins / Developers / Owner: no limitations and can run management actions.</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
