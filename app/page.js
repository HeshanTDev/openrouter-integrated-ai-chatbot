"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

const MODELS = [
  { id: "stepfun/step-3.5-flash:free", name: "Step Flash 3.5" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nemotron 120B" },
  { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large" },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [model, setModel] = useState(MODELS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const initialLoadDone = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const savedChats = localStorage.getItem("chats");
    const savedModel = localStorage.getItem("selectedModel");
    const savedActiveId = localStorage.getItem("activeChatId");

    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChats(parsed);
      if (savedActiveId && parsed.find((c) => c.id === savedActiveId)) {
        setActiveChatId(savedActiveId);
      } else if (parsed.length > 0) {
        setActiveChatId(parsed[0].id);
      }
    }

    if (savedModel) setModel(savedModel);
    setMounted(true);
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats, mounted]);

  // Save active chat id
  useEffect(() => {
    if (!mounted) return;
    if (activeChatId) localStorage.setItem("activeChatId", activeChatId);
  }, [activeChatId, mounted]);

  // Save model selection
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("selectedModel", model);
  }, [model, mounted]);

  // Fix activeChatId if the selected chat was deleted
  useEffect(() => {
    if (!mounted || !activeChatId) return;
    if (chats.length === 0) {
      setActiveChatId(null);
    } else if (!chats.find((c) => c.id === activeChatId)) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId, mounted]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createNewChat = useCallback(() => {
    const newChat = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  }, []);

  const deleteChat = useCallback(
    (chatId) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
    },
    []
  );

  const createChatWithMessage = useCallback((targetChatId, title, initialMessages) => {
    const newChat = {
      id: targetChatId,
      title: title,
      messages: initialMessages,
      createdAt: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(targetChatId);
    setSidebarOpen(false);
  }, []);

  const updateChat = useCallback((chatId, updater) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? updater(c) : c))
    );
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="flex gap-1.5">
          <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "#10a37f" }} />
          <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "#10a37f" }} />
          <span className="dot-bounce w-2 h-2 rounded-full" style={{ background: "#10a37f" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-30 md:z-auto h-full transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ width: "260px" }}
      >
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setSidebarOpen(false);
          }}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          model={model}
          models={MODELS}
          onModelChange={setModel}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ChatWindow
          key={activeChatId || "new-chat"}
          chat={activeChat}
          model={model}
          models={MODELS}
          onUpdateChat={updateChat}
          onNewChat={createNewChat}
          onCreateChatWithMessage={createChatWithMessage}
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
        />
      </div>
    </div>
  );
}
