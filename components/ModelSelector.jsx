"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ModelSelector({ model, models, onModelChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = models.find((m) => m.id === model) || models[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-colors"
        style={{
          background: "var(--hover-bg)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <span className="truncate mr-1">{selected.name}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--text-secondary)" }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 rounded-xl shadow-lg z-50 border overflow-hidden"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onModelChange(m.id);
                setOpen(false);
              }}
              className="flex items-center w-full px-3 py-2.5 text-sm text-left transition-colors"
              style={{
                background: m.id === model ? "var(--hover-bg)" : "transparent",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => {
                if (m.id !== model) e.currentTarget.style.background = "var(--hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (m.id !== model) e.currentTarget.style.background = "transparent";
              }}
            >
              <span className="flex-1 truncate">{m.name}</span>
              {m.id === model && (
                <span className="ml-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#10a37f" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
