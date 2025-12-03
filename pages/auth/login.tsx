
import Link from "next/link";
import Layout from "../../components/Layout";

export default function LoginPage() {
  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-card glass-card">
          <div
            className="aurora-wrapper"
            style={{ padding: "2rem 1.8rem", borderRight: "1px solid rgba(15,23,42,0.9)" }}
          >
            <div className="aurora-layer" />
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Welcome back</h2>
            <p className="text-muted-sm">
              Log in to manage your VPS, Minecraft, and bot instances. AunuSpace AI is
              ready to help with any issue.
            </p>
            <ul className="text-muted-sm" style={{ marginTop: "0.8rem" }}>
              <li>Crypto-friendly billing</li>
              <li>Auto deploy via Pterodactyl</li>
              <li>Role-aware AunuSpace AI assistant</li>
            </ul>
          </div>

          <div style={{ padding: "2rem 1.8rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.8rem" }}>Login</h3>
            <form method="POST" action="/api/auth/login">
              <div style={{ marginBottom: "0.7rem" }}>
                <label style={{ fontSize: "0.8rem" }}>Email</label>
                <input type="email" name="email" required className="input-dark" />
              </div>
              <div style={{ marginBottom: "0.7rem" }}>
                <label style={{ fontSize: "0.8rem" }}>Password</label>
                <input type="password" name="password" required className="input-dark" />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.8rem",
                  fontSize: "0.8rem"
                }}
              >
                <label>
                  <input type="checkbox" name="remember" /> Remember me
                </label>
                <Link href="#">Forgot password?</Link>
              </div>
              <button type="submit" className="btn-neon" style={{ width: "100%" }}>
                Login
              </button>
            </form>
            <p style={{ fontSize: "0.8rem", marginTop: "0.8rem", color: "#9ca3af" }}>
              New to AunuCloud?{" "}
              <Link href="/auth/register" style={{ color: "#22d3ee" }}>
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
