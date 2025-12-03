
import { FormEvent, useState } from "react";
import { Role } from "../lib/roles";

interface Message {
  from: "user" | "ai";
  text: string;
}

// declare global puter from Puter.js
declare global {
  interface Window {
    puter?: any;
  }
}

export default function AiChatPanel({ role }: { role: Role }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: "Hi, I'm AunuSpace AI (powered by Puter). Ask me anything about your AunuCloud services."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (typeof window === "undefined" || !window.puter || !window.puter.ai) {
        throw new Error("Puter.js is not loaded yet.");
      }

      const puter = window.puter;

      // Build a small system prompt to explain roles & limits
      const systemPrefix = `You are AunuSpace AI, integrated in AunuCloud dashboard. The user role is ${role}. ` +
        `Owner/Developer/Admin have no limits. Customer has medium limits. Member has heavy restrictions. ` +
        `Help with cloud hosting, crypto payments, Pterodactyl, Oxapay, and general questions.`;

      const prompt = `${systemPrefix}

User: ${trimmed}`;

      const completion = await puter.ai.chat(prompt, {
        model: "gpt-4.1-mini"
      });

      // Dev docs show string or object; handle both cases.
      let replyText = "";
      if (typeof completion === "string") {
        replyText = completion;
      } else if (completion?.message?.content) {
        // Some variants return message { content: [...] }
        const content = completion.message.content;
        if (Array.isArray(content)) {
          replyText = content.map((c: any) => c.text || "").join(" ");
        } else {
          replyText = String(content);
        }
      } else {
        replyText = JSON.stringify(completion);
      }

      setMessages((prev) => [...prev, { from: "ai", text: replyText }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text:
            "Sorry, I couldn't reach AunuSpace AI via Puter right now. " +
            (err?.message || "")
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card glass-card-floating" style={{ padding: "1.4rem", height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ fontSize: "1.05rem", marginBottom: "0.4rem" }}>AunuSpace AI</h2>
      <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.8rem" }}>
        Powered by <strong>Puter.js</strong>. Your role: <strong>{role}</strong>. Some capabilities
        may be limited depending on your role.
      </p>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          borderRadius: "1rem",
          border: "1px solid rgba(30,64,175,0.8)",
          padding: "0.7rem",
          marginBottom: "0.7rem",
          background:
            "radial-gradient(circle at top, rgba(15,23,42,0.95), rgba(15,23,42,0.9))"
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "0.45rem",
              textAlign: m.from === "user" ? "right" : "left"
            }}
          >
            <div
              style={{
                display: "inline-block",
                maxWidth: "100%",
                padding: "0.45rem 0.7rem",
                borderRadius: "0.9rem",
                fontSize: "0.8rem",
                background:
                  m.from === "user"
                    ? "linear-gradient(to right, #22d3ee, #0ea5e9)"
                    : "rgba(15,23,42,0.95)",
                color: m.from === "user" ? "#020617" : "#e5e7eb",
                border:
                  m.from === "user"
                    ? "1px solid rgba(226,232,240,0.5)"
                    : "1px solid rgba(30,64,175,0.8)"
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Thinking...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          className="input-dark"
          placeholder="Ask AunuSpace AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-neon" style={{ whiteSpace: "nowrap" }}>
          Send
        </button>
      </form>
    </div>
  );
}
