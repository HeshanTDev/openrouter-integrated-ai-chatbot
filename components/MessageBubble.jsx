"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, User, Sparkles } from "lucide-react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      style={{
        background: copied ? "rgba(16, 185, 129, 0.1)" : "var(--hover-bg)",
        color: copied ? "#10b981" : "var(--text-secondary)",
      }}
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-2 md:gap-3 msg-enter mb-2">
        <div
          className="max-w-[85%] md:max-w-[75%] px-4 md:px-5 py-3 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed shadow-md shadow-emerald-500/10 font-medium"
          style={{
            background: "var(--bg-message-user)",
            color: "var(--text-user-msg)",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm border"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
        >
          <User size={15} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 md:gap-4 msg-enter mb-2 w-full max-w-full">
      {/* Premium AI Avatar */}
      <div
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-[0_0_12px_var(--shadow-glow)] bg-gradient-to-br from-emerald-400 to-green-600 border border-transparent"
        style={{ color: "#fff" }}
      >
        <Sparkles size={16} className="text-white drop-shadow-md" />
      </div>

      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div
          className="px-4 md:px-6 py-3.5 md:py-4 rounded-2xl rounded-tl-sm text-[15px] shadow-sm border transition-shadow duration-300 hover:shadow-md"
          style={{
            background: "var(--bg-message-ai)",
            color: "var(--text-ai-msg)",
            borderColor: "var(--border-color)",
            wordBreak: "break-word",
          }}
        >
          <div className="prose-ai">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  if (!inline && match) {
                    return (
                      <div className="relative group/code my-4 shadow-lg rounded-xl overflow-hidden border border-[#1e293b]">
                        <div
                          className="flex items-center justify-between px-4 py-2 text-xs font-semibold tracking-wider uppercase"
                          style={{ background: "#0f172a", color: "#94a3b8" }}
                        >
                          <span>{match[1]}</span>
                          <CopyButton text={codeString} />
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: "0 0 12px 12px",
                            fontSize: "0.85rem",
                            padding: "1rem",
                            background: "#1e293b"
                          }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Copy full message */}
        <div className="flex items-center gap-2 pl-2 opacity-60 hover:opacity-100 transition-opacity">
          <CopyButton text={message.content} />
        </div>
      </div>
    </div>
  );
}
