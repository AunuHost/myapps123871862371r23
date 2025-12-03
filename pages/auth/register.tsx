
import Link from "next/link";
import Layout from "../../components/Layout";

export default function RegisterPage() {
  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-card glass-card">
          <div style={{ padding: "2rem 1.8rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.8rem" }}>Create account</h3>
            <form method="POST" action="/api/auth/register">
              <div style={{ marginBottom: "0.7rem" }}>
                <label style={{ fontSize: "0.8rem" }}>Username</label>
                <input type="text" name="username" required className="input-dark" />
              </div>
              <div style={{ marginBottom: "0.7rem" }}>
                <label style={{ fontSize: "0.8rem" }}>Email</label>
                <input type="email" name="email" required className="input-dark" />
              </div>
              <div style={{ marginBottom: "0.7rem" }}>
                <label style={{ fontSize: "0.8rem" }}>Password</label>
                <input type="password" name="password" required className="input-dark" />
              </div>
              <div style={{ marginBottom: "0.7rem" }}>
                <label style={{ fontSize: "0.8rem" }}>Confirm Password</label>
                <input type="password" name="confirmPassword" required className="input-dark" />
              </div>
              <button type="submit" className="btn-neon" style={{ width: "100%", marginTop: "0.4rem" }}>
                Register
              </button>
            </form>
            <p style={{ fontSize: "0.8rem", marginTop: "0.8rem", color: "#9ca3af" }}>
              Already have an account?{" "}
              <Link href="/auth/login" style={{ color: "#22d3ee" }}>
                Login
              </Link>
            </p>
          </div>

          <div className="aurora-wrapper" style={{ padding: "2rem 1.8rem" }}>
            <div className="aurora-layer" />
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.6rem" }}>
              Dimensional cloud experience.
            </h2>
            <p className="text-muted-sm">
              Once registered, you’ll get a <strong>Customer</strong> status by default.
              Owner can promote other users to <strong>Developer</strong> or <strong>Admin</strong> from the dashboard.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
