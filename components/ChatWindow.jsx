"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { SendHorizonal, Menu, Trash2, Sparkles, Zap, Code, Mail } from "lucide-react";

const SUGGESTIONS = [
  { icon: <Zap size={16}/>, text: "Explain quantum computing in simple terms" },
  { icon: <Code size={16}/>, text: "Write a Python script to scrape a website" },
  { icon: <Mail size={16}/>, text: "Help me draft a professional email to my boss" },
  { icon: <Sparkles size={16}/>, text: "What are some healthy dinner recipes?" },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function ChatWindow({
  chat, model, models, onUpdateChat, onNewChat, onCreateChatWithMessage, onToggleSidebar,
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const messages = chat?.messages || [];
  const modelName = models.find((m) => m.id === model)?.name || model;

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isLoading) return;
      setError(null);

      const userMsg = { id: generateId(), role: "user", content: content.trim() };

      let targetChatId = chat?.id;
      let historyMessages = [...(chat?.messages || []), userMsg];
      
      const isFirstMessage = !chat || (chat.messages || []).length === 0;
      const newTitle = isFirstMessage
        ? content.trim().slice(0, 40) + (content.length > 40 ? "…" : "")
        : chat?.title;

      // Update chat with user message securely
      if (!targetChatId) {
        targetChatId = generateId();
        onCreateChatWithMessage(targetChatId, newTitle, historyMessages);
      } else {
        onUpdateChat(targetChatId, (c) => ({
          ...c,
          title: newTitle || c.title,
          messages: historyMessages,
        }));
      }

      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyMessages.map(({ role, content }) => ({ role, content })),
            model,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "API error");
        }

        const aiMsg = { id: generateId(), role: "assistant", content: data.content };

        if (targetChatId) {
          onUpdateChat(targetChatId, (c) => ({
            ...c,
            messages: [...c.messages.filter((m) => m.id !== userMsg.id), userMsg, aiMsg],
          }));
        }
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
        if (targetChatId) {
          onUpdateChat(targetChatId, (c) => ({
            ...c,
            messages: c.messages ? c.messages.filter((m) => m.id !== userMsg.id) : [],
          }));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [chat, model, isLoading, onUpdateChat, onCreateChatWithMessage]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    if (!chat) return;
    onUpdateChat(chat.id, (c) => ({ ...c, messages: [], title: "New Chat" }));
    setError(null);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b shrink-0 glassmorphism relative z-10 shadow-sm"
        style={{ borderColor: "var(--border-color)", borderBottomWidth: "1px" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl md:hidden transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-primary)" }}
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--shadow-glow)]" style={{ background: "#10b981" }} />
            <span className="text-[15px] font-semibold tracking-tight truncate max-w-[150px] md:max-w-none" style={{ color: "var(--text-primary)" }}>
              {modelName}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <button
              type="button"
              onClick={clearChat}
              title="Clear chat"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border"
              style={{ 
                color: "#ef4444", 
                borderColor: "rgba(239, 68, 68, 0.2)",
                background: "rgba(239, 68, 68, 0.05)" 
              }}
            >
              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col relative">
        {isEmpty ? (
          /* Welcome screen */
          <div className="flex-1 flex flex-col items-center justify-center h-full px-5 text-center mt-[-40px]">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20"
              style={{ background: "var(--bg-message-user)" }}
            >
              <Sparkles size={32} color="#fff" />
            </div>
            <h1 className="text-3xl font-extrabold mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
              How can I assist you today?
            </h1>
            <p className="text-base mb-10 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Experience the power of advanced AI models. Currently using{" "}
              <span className="font-semibold text-[#10b981] dark:text-[#34d399]">{modelName}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => sendMessage(s.text)}
                  className="flex items-start gap-3 text-sm text-left px-5 py-4 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none"
                  style={{
                    background: "var(--bg-sidebar)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => {
                     e.currentTarget.style.borderColor = "#10b981";
                     e.currentTarget.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                     e.currentTarget.style.borderColor = "var(--border-color)";
                     e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10 shrink-0 text-[#10b981] dark:text-[#34d399]">
                    {s.icon}
                  </div>
                  <span className="font-medium leading-snug">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8 mb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div
                className="text-sm px-5 py-4 rounded-xl border msg-enter font-medium shadow-sm"
                style={{
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.05)",
                  borderColor: "rgba(239, 68, 68, 0.2)",
                  borderLeftWidth: "4px"
                }}
              >
                ⚠️ {error}
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none -top-12 h-12" />
        <div className="px-3 pb-4 md:px-6 md:pb-6 relative z-10 glassmorphism rounded-t-3xl pt-2">
          <div
            className="flex items-end gap-3 max-w-4xl mx-auto rounded-3xl border px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#10b981]/50"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message NeoChat..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-relaxed py-2 md:py-3 px-2 custom-scrollbar"
              style={{
                color: "var(--text-primary)",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="p-3 mb-1 rounded-2xl transition-all duration-300 shrink-0 disabled:opacity-50 disabled:scale-100 hover:scale-[1.05] shadow-sm hover:shadow-md active:scale-95"
              style={{
                background: !input.trim() || isLoading ? "var(--hover-bg)" : "var(--btn-bg)",
                color: !input.trim() || isLoading ? "var(--text-secondary)" : "#fff",
              }}
            >
              <SendHorizonal size={20} />
            </button>
          </div>
          <p className="text-center text-[11px] md:text-xs mt-3 font-medium opacity-70" style={{ color: "var(--text-secondary)" }}>
            NeoChat is an experimental AI and can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
