
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/hosting/vps", label: "VPS" },
  { href: "/hosting/minecraft", label: "Minecraft" },
  { href: "/hosting/bot", label: "Bot Hosting" }
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="aurora-wrapper" style={{ position: "sticky", top: 0, zIndex: 40 }}>
      <div className="aurora-layer" style={{ opacity: 0.35 }} />
      <nav
        style={{
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(148,163,184,0.3)",
          background: "linear-gradient(to right, rgba(15,23,42,0.96), rgba(15,23,42,0.85))"
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "0.7rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <Image src="/assets/aunucloud-logo.png" width={42} height={42} alt="AunuCloud Logo" />
            <div style={{ lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: "Space Grotesk, system-ui",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  fontSize: "0.85rem",
                  textTransform: "uppercase"
                }}
              >
                AunuCloud
              </span>
              <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>NVMe • Game • Bot • VPS</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div
            className="nav-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.3rem"
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: "0.9rem",
                  color: router.pathname === item.href ? "#e5e7eb" : "#9ca3af",
                  position: "relative"
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/auth/login" className="btn-neon-outline">
              Login
            </Link>
            <Link href="/auth/register" className="btn-neon">
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="nav-mobile-toggle btn-neon-outline"
            style={{
              padding: "0.35rem 0.9rem",
              fontSize: "0.8rem",
              display: "none"
            }}
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu - for simplicity visibility controlled via CSS media queries */}
        {open && (
          <div className="nav-mobile" style={{ padding: "0 1.25rem 0.8rem" }}>
            {navItems.map((item) => (
              <div key={item.href} style={{ marginBottom: "0.5rem" }}>
                <Link href={item.href}>{item.label}</Link>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <Link href="/auth/login" className="btn-neon-outline" style={{ flex: 1 }}>
                Login
              </Link>
              <Link href="/auth/register" className="btn-neon" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
