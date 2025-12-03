
import Layout from "../../components/Layout";

const plans = [
  {
    name: "MC-1",
    price: "8",
    stock: 1,
    features: ["1 vCPU", "1 GB RAM", "20 GB NVMe", "Random node", "Panel auto-deploy"]
  },
  {
    name: "MC-2",
    price: "15",
    stock: 3,
    features: ["2 vCPU", "2 GB RAM", "40 GB NVMe", "Priority location", "DDoS protection"]
  }
];

export default function VpsPage() {
  return (
    <Layout>
      <h1 style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>Minecraft Hosting</h1>
      <p style={{ fontSize: "0.9rem", color: "#9ca3af", maxWidth: 520 }}>
        Select a Minecraft plan. Stock is controlled from the admin dashboard; when an admin
        sets stock to 1, only one instance will be purchasable.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "1.4rem",
          marginTop: "1.2rem"
        }}
      >
        {plans.map((p) => (
          <div key={p.name} className="glass-card glass-card-floating" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <h2 style={{ fontSize: "1.1rem" }}>{p.name}</h2>
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Stock:{" "}
                <strong style={{ color: p.stock > 0 ? "#22c55e" : "#f97316" }}>
                  {p.stock > 0 ? p.stock : "Out"}
                </strong>
              </span>
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              ${p.price}
              <span style={{ fontSize: "0.8rem" }}>/month</span>
            </div>
            <ul style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.7rem" }}>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              className="btn-neon"
              style={{ marginTop: "0.9rem", width: "100%" }}
              disabled={p.stock <= 0}
              onClick={() => alert("Call /api/payments/create-oxapay here")}
            >
              {p.stock > 0 ? "Pay with Crypto" : "Out of stock"}
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
