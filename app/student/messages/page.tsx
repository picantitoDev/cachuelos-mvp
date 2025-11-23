"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function StudentMessagesPage() {
  const params = useSearchParams();
  const router = useRouter();

  const withUser = params.get("with");   // ID del cliente
  const taskId = params.get("task");     // Tarea asociada

  const [user, setUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [task, setTask] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  // =========================================
  // 1️⃣ Cargar estudiante logueado
  // =========================================
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
  }, []);

  // =========================================
  // 2️⃣ Cargar conversaciones del estudiante
  // =========================================
  useEffect(() => {
    if (!user?.id) return;

    async function loadConversations() {
      const res = await fetch(`/api/conversations?userId=${user.id}`);
      const data = await res.json();
      setConversations(data);
    }

    loadConversations();
  }, [user]);

  // =========================================
  // 3️⃣ Cargar info del otro usuario
  // =========================================
  useEffect(() => {
    if (!withUser) return;

    async function loadOther() {
      const res = await fetch(`/api/users/${withUser}`);
      const data = await res.json();
      setOtherUser(data);
    }
    loadOther();
  }, [withUser]);

  // =========================================
  // 4️⃣ Cargar tarea asociada
  // =========================================
  useEffect(() => {
    if (!taskId) return;

    async function loadTask() {
      const res = await fetch(`/api/tasks/${taskId}`);
      const data = await res.json();
      setTask(data);
    }
    loadTask();
  }, [taskId]);

  // =========================================
  // 5️⃣ Cargar mensajes del chat
  // =========================================
  useEffect(() => {
    if (!withUser || !taskId || !user?.id) return;

    async function loadMessages() {
      const res = await fetch(
        `/api/messages/list?user1=${user.id}&user2=${withUser}&taskId=${taskId}`
      );
      const data = await res.json();
      setMessages(data);
    }

    loadMessages();
  }, [withUser, taskId, user]);

  // =========================================
  // 6️⃣ Enviar mensaje
  // =========================================
  async function sendMessage() {
    if (!input.trim()) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: user.id,
        receiverId: Number(withUser),
        taskId: Number(taskId),
        content: input,
      }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setInput("");
    }
  }

  // =========================================
  // 7️⃣ Auto-scroll
  // =========================================
  useEffect(() => {
    const el = document.getElementById("bottom-chat");
    el?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid grid-cols-3 h-[85vh] bg-white rounded-xl shadow">

      {/* LEFT — Conversaciones */}
      <div className="border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Conversaciones</h2>

        {conversations.length === 0 && (
          <p className="text-sm text-gray-500">Aún no tienes mensajes</p>
        )}

        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() =>
              router.push(`/student/messages?with=${c.otherUserId}&task=${c.taskId}`)
            }
            className="block p-3 w-full text-left rounded hover:bg-gray-100"
          >
            <p className="font-semibold">{c.otherUserName}</p>
            <p className="text-[11px] text-gray-500">
              {c.taskTitle} — <span className="italic">{c.lastMessage}</span>
            </p>
          </button>
        ))}
      </div>

      {/* RIGHT — Chat */}
      <div className="col-span-2 flex flex-col">
        {!withUser || !taskId ? (
          <p className="p-10 text-gray-500">Selecciona una conversación</p>
        ) : (
          <>
            {/* HEADER DEL CHAT */}
            <div className="border-b p-4 bg-gray-50">
              <p className="text-lg font-semibold">
                {otherUser ? otherUser.name : "Cargando..."}
              </p>

              {task && (
                <p className="text-sm text-gray-500">
                  Tarea: <span className="font-medium">{task.title}</span> · 
                  <span className="text-indigo-600 ml-1 font-medium">
                    {task.status}
                  </span>
                </p>
              )}
            </div>

            {/* MENSAJES */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm">Aún no hay mensajes…</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.senderId === user.id
                        ? "ml-auto bg-indigo-100 text-right"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}
              <div id="bottom-chat"></div>
            </div>

            {/* INPUT */}
            <div className="p-4 border-t flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje…"
                className="flex-1 border rounded-lg p-3"
              />

              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Enviar
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
