"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 msg-enter">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
        style={{ background: "#10a37f", color: "#fff" }}
      >
        AI
      </div>

      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ background: "var(--bg-message-ai)" }}
      >
        <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "var(--text-secondary)" }} />
        <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "var(--text-secondary)" }} />
        <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "var(--text-secondary)" }} />
      </div>
    </div>
  );
}
