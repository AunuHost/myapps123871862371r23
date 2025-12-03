
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Role } from "../../lib/roles";

interface AdminOrder {
  id: string;
  userId: string;
  serviceType: "VPS" | "MC" | "BOT";
  planId: string;
  location: string;
  status: string;
  amountUsd: number;
  createdAt?: string;
  paidAt?: string;
}

interface AdminPlan {
  id: string;
  type: "VPS" | "MC" | "BOT";
  planId: string;
  name: string;
  stock: number;
}

export default function AdminDashboardPage() {
  // In a real app, this should come from your auth system:
  const [role] = useState<Role>("OWNER");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, stockRes] = await Promise.all([
          fetch("/api/admin/orders"),
          fetch("/api/admin/stock")
        ]);
        const ordersJson = await ordersRes.json();
        const stockJson = await stockRes.json();
        setOrders(ordersJson.orders ?? []);
        setPlans(stockJson.plans ?? []);
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
        <h1>Admin</h1>
        <p style={{ color: "#fca5a5", fontSize: "0.9rem" }}>
          You must be Owner / Developer / Admin to view this page.
        </p>
      </Layout>
    );
  }

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  return (
    <Layout>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>Admin dashboard</h1>
      <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "1rem" }}>
        High level overview of recent orders and plan stock. This page reads from MongoDB
        via <code>orders</code> and <code>plans</code> collections.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "1rem",
          marginBottom: "1.5rem"
        }}
      >
        <div className="glass-card glass-card-floating" style={{ padding: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Total orders</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{totalOrders}</div>
        </div>
        <div className="glass-card glass-card-floating" style={{ padding: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Paid</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{paidOrders}</div>
        </div>
        <div className="glass-card glass-card-floating" style={{ padding: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Pending</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{pendingOrders}</div>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
            gap: "1.4rem"
          }}
        >
          {/* Orders table */}
          <div className="glass-card glass-card-floating" style={{ padding: "1.2rem" }}>
            <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>Latest orders</h2>
            <div style={{ maxHeight: "340px", overflowY: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.8rem"
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", color: "#9ca3af" }}>
                    <th style={{ paddingBottom: "0.4rem" }}>User</th>
                    <th style={{ paddingBottom: "0.4rem" }}>Plan</th>
                    <th style={{ paddingBottom: "0.4rem" }}>Type</th>
                    <th style={{ paddingBottom: "0.4rem" }}>Loc</th>
                    <th style={{ paddingBottom: "0.4rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={String(o.id)}>
                      <td style={{ padding: "0.25rem 0" }}>{o.userId}</td>
                      <td style={{ padding: "0.25rem 0" }}>{o.planId}</td>
                      <td style={{ padding: "0.25rem 0" }}>{o.serviceType}</td>
                      <td style={{ padding: "0.25rem 0" }}>{o.location}</td>
                      <td style={{ padding: "0.25rem 0" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "999px",
                            border: "1px solid rgba(148,163,184,0.6)",
                            color:
                              o.status === "PAID"
                                ? "#bbf7d0"
                                : o.status === "PENDING"
                                ? "#fde68a"
                                : "#fecaca"
                          }}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ paddingTop: "0.5rem", color: "#6b7280" }}>
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock table */}
          <div className="glass-card glass-card-floating" style={{ padding: "1.2rem" }}>
            <h2 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>Plan stock</h2>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
              Stock values come from the <code>plans</code> collection. When you set stock to
              <code>1</code>, only one service can be purchased.
            </p>
            <div style={{ maxHeight: "340px", overflowY: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.8rem"
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", color: "#9ca3af" }}>
                    <th style={{ paddingBottom: "0.4rem" }}>Type</th>
                    <th style={{ paddingBottom: "0.4rem" }}>Plan</th>
                    <th style={{ paddingBottom: "0.4rem" }}>Name</th>
                    <th style={{ paddingBottom: "0.4rem" }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((p) => (
                    <tr key={String(p.id)}>
                      <td style={{ padding: "0.25rem 0" }}>{p.type}</td>
                      <td style={{ padding: "0.25rem 0" }}>{p.planId}</td>
                      <td style={{ padding: "0.25rem 0" }}>{p.name}</td>
                      <td style={{ padding: "0.25rem 0" }}>
                        <strong
                          style={{
                            color: p.stock > 0 ? "#bbf7d0" : "#fecaca"
                          }}
                        >
                          {p.stock}
                        </strong>
                      </td>
                    </tr>
                  ))}
                  {plans.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ paddingTop: "0.5rem", color: "#6b7280" }}>
                        No plans / stock configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
