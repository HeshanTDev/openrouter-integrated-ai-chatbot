"use client";

import { Moon, Sun, Plus, Trash2, X, MessageSquare, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import ModelSelector from "./ModelSelector";

export default function Sidebar({
  chats, activeChatId, onSelectChat, onNewChat, onDeleteChat,
  model, models, onModelChange, onClose,
}) {
  return (
    <div
      className="flex flex-col h-full border-r glassmorphism shadow-2xl relative w-full"
      style={{
        borderColor: "var(--border-color)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 h-[70px] border-b"
        style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-600 shadow-md shadow-emerald-500/30">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
            NeoChat
          </span>
        </div>
        {/* Mobile close */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-2 rounded-xl transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: "var(--text-secondary)" }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Action Area */}
      <div className="px-4 pt-5 pb-3">
        <button
          type="button"
          onClick={onNewChat}
          className="group flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
          style={{
            background: "var(--btn-bg)",
            color: "var(--btn-text)",
          }}
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300" />
          New Thread
        </button>
      </div>

      {/* Model selector */}
      <div className="px-4 pb-2 mt-1">
        <ModelSelector model={model} models={models} onModelChange={onModelChange} />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <p
          className="text-xs font-bold uppercase tracking-wider px-2 pb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          Recent Conversations
        </p>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 opacity-60">
            <MessageSquare size={24} style={{ color: "var(--text-secondary)" }} className="mb-2" />
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              No history found
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li key={chat.id} className="relative group w-full">
                <button
                  type="button"
                  onClick={() => onSelectChat(chat.id)}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-left transition-all duration-200"
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
                  <MessageSquare 
                    size={16} 
                    className="shrink-0 transition-colors" 
                    style={{ color: activeChatId === chat.id ? "#10b981" : "var(--text-secondary)" }} 
                  />
                  <span className="flex-1 truncate pr-8 font-medium">{chat.title}</span>
                </button>

                {/* Absolutely positioned delete button - never nested */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 p-1.5 hover:bg-red-500/15 rounded-lg z-10"
                  title="Delete Chat"
                >
                  <Trash2 size={15} className="text-red-500 transition-transform hover:scale-110" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
