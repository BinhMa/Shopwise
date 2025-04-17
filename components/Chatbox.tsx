"use client";

import { useState, FormEvent } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function Chatbox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Chào bạn! Mình có thể giúp gì?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Gọi API route
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const { message } = await resp.json();
    setMessages(prev => [...prev, { role: "assistant", content: message.content }]);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="h-64 overflow-y-auto border p-2 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <span className={m.role === "assistant" ? "font-semibold" : ""}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Nhập câu hỏi hoặc mô tả sản phẩm..."
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : "Gửi"}
        </button>
      </form>
    </div>
  );
}
