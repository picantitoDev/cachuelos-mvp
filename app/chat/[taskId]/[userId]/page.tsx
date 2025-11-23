"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();

  const taskId = Number(params.taskId);
  const partnerId = Number(params.userId);

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) return router.push("/login");
    setUser(JSON.parse(u));
  }, []);

  // Load messages
  useEffect(() => {
    if (!user) return;

    async function load() {
      const res = await fetch(
        `/api/messages/list?taskId=${taskId}&userA=${user.id}&userB=${partnerId}`
      );
      const data = await res.json();
      setMessages(data);
    }

    load();
    const interval = setInterval(load, 2000); // Polling cada 2 segundos

    return () => clearInterval(interval);
  }, [user]);

  async function sendMessage() {
    if (!text.trim()) return;

    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        senderId: user.id,
        receiverId: partnerId,
        taskId,
        content: text,
      }),
    });

    setText("");
  }

  return (
    <div className="h-full flex flex-col p-4">

      <button onClick={() => router.back()} className="text-indigo-600 mb-4">
        ← Regresar
      </button>

      <div className="flex-1 overflow-y-auto space-y-3 border p-4 rounded-lg bg-white">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-xs p-3 rounded-lg ${
              m.senderId === user.id
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg p-3"
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
