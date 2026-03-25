"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, User } from "lucide-react";

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
      onClick={handleCopy}
      title="Copy"
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-150"
      style={{
        background: "var(--hover-bg)",
        color: "var(--text-secondary)",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-2 md:gap-3 msg-enter">
        <div
          className="max-w-[85%] md:max-w-[75%] px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
          style={{
            background: "var(--bg-message-user)",
            color: "var(--text-user-msg)",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "var(--hover-bg)", color: "var(--text-secondary)" }}
        >
          <User size={14} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 md:gap-3 msg-enter">
      {/* AI Avatar */}
      <div
        className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] md:text-xs font-bold"
        style={{ background: "#10a37f", color: "#fff" }}
      >
        AI
      </div>

      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div
          className="px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-tl-sm text-sm"
          style={{
            background: "var(--bg-message-ai)",
            color: "var(--text-ai-msg)",
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
                      <div className="relative group/code">
                        <div
                          className="flex items-center justify-between px-3 py-1.5 rounded-t-lg text-xs"
                          style={{ background: "#1a1a2e", color: "#8e8ea0" }}
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
                            borderRadius: "0 0 8px 8px",
                            fontSize: "0.82rem",
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
        <div className="flex items-center gap-2 pl-1">
          <CopyButton text={message.content} />
        </div>
      </div>
    </div>
  );
}
