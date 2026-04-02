"use client";

import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 md:gap-4 msg-enter mb-2 w-full max-w-full">
      {/* Premium AI Avatar */}
      <div
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-[0_0_12px_var(--shadow-glow)] bg-gradient-to-br from-emerald-400 to-green-600 border border-transparent"
        style={{ color: "#fff" }}
      >
        <Sparkles size={16} className="text-white drop-shadow-md" />
      </div>

      <div
        className="flex items-center gap-2 px-4 md:px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border"
        style={{
          background: "var(--bg-message-ai)",
          borderColor: "var(--border-color)",
        }}
      >
        <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
        <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "#10b981", opacity: 0.8 }} />
        <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "#10b981", opacity: 0.6 }} />
      </div>
    </div>
  );
}
