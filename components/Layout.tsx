
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="aurora-wrapper">
      <Navbar />
      <main
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "2.25rem 1.25rem 3rem"
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
