"use client";

import { Moon, Sun, Plus, Trash2, X, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";

export default function Sidebar({
  chats, activeChatId, onSelectChat, onNewChat, onDeleteChat,
  model, models, onModelChange, onClose,
}) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
    else if (document.documentElement.classList.contains("dark")) setTheme("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border-color)",
        width: "260px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          NeoChat
        </span>
        {/* Mobile close */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-1 rounded-lg transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* New Chat button */}
      <div className="px-3 py-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
          style={{
            background: "var(--btn-bg)",
            color: "var(--btn-text)",
          }}
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Model selector */}
      <div className="px-3 pb-2">
        <ModelSelector model={model} models={models} onModelChange={onModelChange} />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p
          className="text-xs font-semibold uppercase tracking-wider px-2 pb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Recent Chats
        </p>

        {chats.length === 0 ? (
          <p className="text-xs px-2 mt-2" style={{ color: "var(--text-secondary)" }}>
            No previous chats
          </p>
        ) : (
          <ul className="space-y-0.5 md:space-y-1">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  type="button"
                  onClick={() => onSelectChat(chat.id)}
                  className="group flex items-center gap-2 w-full px-2.5 md:px-3 py-2 md:py-2.5 rounded-xl text-sm text-left transition-all duration-150"
                  style={{
                    background: activeChatId === chat.id ? "var(--hover-bg)" : "transparent",
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => {
                    if (activeChatId !== chat.id)
                      e.currentTarget.style.background = "var(--hover-bg)";
                  }}
                  onMouseLeave={(e) => {
                    if (activeChatId !== chat.id)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <MessageSquare size={14} className="shrink-0" style={{ color: "var(--text-secondary)" }} />
                  <span className="flex-1 truncate">{chat.title}</span>
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 hover:bg-red-500/10 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                  >
                    <Trash2 size={13} style={{ color: "#ef4444" }} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer: theme toggle */}
      <div
        className="px-4 py-3 border-t flex items-center gap-2"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}
