
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import AiChatPanel from "../../components/AiChatPanel";
import { Role } from "../../lib/roles";

interface UserProfile {
  id: string;
  username: string;
  role: Role;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // TODO: replace with real /api/auth/me call tied to your auth/session
    setUser({
      id: "demo",
      username: "AunuXdev",
      role: "OWNER"
    });
  }, []);

  if (!user) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>Dashboard</h1>
      <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "1rem" }}>
        Logged in as <strong>{user.username}</strong>{" "}
        <span
          className={`badge-role badge-role-${user.role.toLowerCase()}`}
          style={{ marginLeft: "0.4rem" }}
        >
          {user.role}
        </span>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: "1.4rem"
        }}
      >
        <div className="glass-card glass-card-floating" style={{ padding: "1.4rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.7rem" }}>Your services</h2>
          <p className="text-muted-sm">
            Once a payment is confirmed by OxaPay, a new VPS/hosting will be attached to your
            account and auto-deployed on a random node based on the location you selected.
          </p>
          <ul style={{ marginTop: "0.7rem", fontSize: "0.85rem" }}>
            <li>#1 – VPS-2 • Region: Singapore • Status: Active</li>
            <li>#2 – Minecraft-Basic • Region: Jakarta • Status: Active</li>
          </ul>

          <div style={{ marginTop: "1.1rem" }}>
            <h3 style={{ fontSize: "0.95rem", marginBottom: "0.4rem" }}>Management</h3>
            <ul style={{ fontSize: "0.85rem" }}>
              <li><a href="/dashboard/redeem">Redeem code</a></li>
              {(user.role === "OWNER" ||
                user.role === "DEVELOPER" ||
                user.role === "ADMIN") && (
                <>
                  <li>Manage stock (VPS / Minecraft / Bot)</li>
                  <li>Suspend / unsuspend / extend services</li>
                  <li>Generate redeem codes</li>
                  <li>Assign roles (Owner only adds Admin / Developer)</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <AiChatPanel role={user.role} />
      </div>
    </Layout>
  );
}
