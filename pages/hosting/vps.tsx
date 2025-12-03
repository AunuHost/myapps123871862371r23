
import Layout from "../../components/Layout";
import VpsComingSoonScene from "../../components/VpsComingSoonScene";

export default function VpsComingSoonPage() {
  return (
    <Layout>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: "1.8rem",
          alignItems: "center",
          marginTop: "1rem"
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.8rem",
              padding: "0.25rem 0.7rem",
              borderRadius: "999px",
              border: "1px solid rgba(56,189,248,0.7)",
              color: "#e0f2fe",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              marginBottom: "0.7rem"
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle, #f97316, #ea580c 60%, transparent 65%)",
                boxShadow: "0 0 12px rgba(249,115,22,1)"
              }}
            />
            Interstellar VPS – Coming soon
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 3vw + 1rem, 3.1rem)",
              marginBottom: "0.5rem",
              lineHeight: 1.1
            }}
          >
            We're upgrading our{" "}
            <span
              style={{
                background:
                  "linear-gradient(to right, #22d3ee, #a855f7, #f97316)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent"
              }}
            >
              AunuCloud VPS
            </span>{" "}
            engine.
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#9ca3af", maxWidth: 520 }}>
            Our next‑generation VPS platform is being rebuilt in orbit. Think of KVM
            compute nodes as satellites and your services as autonomous probes.
            While the astronauts finish tightening the bolts, you can already use our
            Minecraft and Bot hosting – fully automated and powered by crypto payments.
          </p>
          <ul
            style={{
              fontSize: "0.85rem",
              color: "#9ca3af",
              marginTop: "0.9rem",
              lineHeight: 1.7
            }}
          >
            <li>True NVMe hypervisors with low‑latency global routing.</li>
            <li>One‑click deploy from your AunuCloud dashboard.</li>
            <li>Seamless integration with AunuSpace AI to manage instances.</li>
          </ul>
          <p style={{ fontSize: "0.85rem", marginTop: "0.9rem", color: "#a5b4fc" }}>
            VPS will appear here once launched. Until then, keep an eye on{" "}
            <strong>Discord</strong> and your dashboard announcements.
          </p>
        </div>

        <div className="glass-card glass-card-floating" style={{ padding: "1rem" }}>
          <VpsComingSoonScene />
        </div>
      </section>
    </Layout>
  );
}
