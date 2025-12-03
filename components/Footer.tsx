
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(15,23,42,0.9)",
        padding: "1.5rem 0 1.8rem",
        marginTop: "3rem",
        background: "radial-gradient(circle at top, #020617, #020617)"
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          fontSize: "0.8rem",
          color: "#9ca3af"
        }}
      >
        <span>© {new Date().getFullYear()} AunuCloud. All rights reserved.</span>
        <span>
          Owner: <strong>AunuXdev</strong> • Developer: <strong>AunuXdev</strong> • Admin:{" "}
          <strong>None</strong>
        </span>
      </div>
    </footer>
  );
}
