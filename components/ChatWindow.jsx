"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { SendHorizonal, Menu, Trash2, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a Python script to scrape a website",
  "Help me draft an email to my boss",
  "What are some healthy dinner recipes?",
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

      // Update chat with user message
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
            // Only modify messages if the chat object exists, ensuring filter runs safely
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
    <div className="flex flex-col h-full" style={{ background: "var(--bg-primary)" }}>
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b shrink-0 h-14 md:h-16"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl md:hidden transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="hidden sm:block" style={{ color: "#10a37f" }} />
            <span className="text-sm font-medium truncate max-w-[150px] md:max-w-none" style={{ color: "var(--text-primary)" }}>
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-colors"
              style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          {isEmpty && (
             <button
                type="button"
                onClick={onNewChat}
                className="p-2 rounded-xl md:hidden transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <Plus size={18} />
              </button>
          )}
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Welcome screen */
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
              style={{ background: "linear-gradient(135deg, #10a37f, #0d8a6a)" }}
            >
              <Sparkles size={26} color="#fff" />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              How can I help you today?
            </h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Experience the power of advanced AI models. Selected:{" "}
              <span className="font-semibold" style={{ color: "#10a37f" }}>{modelName}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-sm text-left px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#10a37f")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl border msg-enter"
                style={{
                  color: "#ef4444",
                  background: "rgba(239,68,68,0.08)",
                  borderColor: "rgba(239,68,68,0.2)",
                }}
              >
                ⚠️ {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className="shrink-0 border-t px-2 pb-2 pt-2 md:px-4 md:pb-4 md:pt-0"
        style={{ borderColor: "var(--border-color)", background: "var(--bg-primary)" }}
      >
        <div
          className="flex items-end gap-2 md:gap-3 max-w-3xl mx-auto rounded-2xl border px-3 py-2 md:px-4 md:py-3 shadow-sm transition-all duration-200 focus-within:border-[#10a37f] focus-within:shadow-md"
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
            className="flex-1 resize-none bg-transparent outline-none text-sm md:text-base leading-relaxed py-1"
            style={{
              color: "var(--text-primary)",
              maxHeight: "160px",
              overflowY: "auto",
            }}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl transition-all duration-200 shrink-0 disabled:opacity-40 hover:scale-105 mb-0.5"
            style={{
              background: !input.trim() || isLoading ? "var(--hover-bg)" : "#10a37f",
              color: !input.trim() || isLoading ? "var(--text-secondary)" : "#fff",
            }}
          >
            <SendHorizonal size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] md:text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
          NeoChat can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
