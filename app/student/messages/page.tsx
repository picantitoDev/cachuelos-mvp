"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function StudentMessagesPage() {
  const params = useSearchParams();
  const router = useRouter();

  const withUser = params.get("with");
  const taskId = params.get("task");

  const [user, setUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [task, setTask] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [showChatMobile, setShowChatMobile] = useState(false); // 📱 igual al cliente

  // 1️⃣ Usuario logueado
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
  }, []);

  // 2️⃣ Conversaciones
  useEffect(() => {
    if (!user?.id) return;

    async function loadConversations() {
      const res = await fetch(`/api/conversations?userId=${user.id}`);
      const data = await res.json();
      setConversations(data);
    }

    loadConversations();
  }, [user]);

  // 3️⃣ Usuario con quien se habla
  useEffect(() => {
    if (!withUser) return;

    async function loadOtherUser() {
      const res = await fetch(`/api/users/${withUser}`);
      const data = await res.json();
      setOtherUser(data);
    }

    loadOtherUser();
  }, [withUser]);

  // 4️⃣ Tarea asociada
  useEffect(() => {
    if (!taskId) return;

    async function loadTask() {
      const res = await fetch(`/api/tasks/${taskId}`);
      const data = await res.json();
      setTask(data);
    }

    loadTask();
  }, [taskId]);

  // 5️⃣ Mensajes
  useEffect(() => {
    if (!withUser || !taskId || !user?.id) return;

    async function loadMessages() {
      const res = await fetch(
        `/api/messages/list?user1=${user.id}&user2=${withUser}&taskId=${taskId}`
      );
      const data = await res.json();
      setMessages(data);

      // 📱 Mostrar chat automáticamente
      setShowChatMobile(true);
    }

    loadMessages();
  }, [withUser, taskId, user]);

  // 6️⃣ Auto-scroll
  useEffect(() => {
    const el = document.getElementById("bottom-chat");
    el?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 7️⃣ Enviar mensaje
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-[85vh] bg-white rounded-xl shadow overflow-hidden">

      {/* 📱 PANEL IZQUIERDO (oculto cuando el chat está abierto en móvil) */}
      <div
        className={`
          border-r bg-gray-50 p-4 overflow-y-auto
          ${showChatMobile ? "hidden md:block" : "block"}
        `}
      >
        <h2 className="font-bold mb-4 text-gray-800 text-lg">Conversaciones</h2>

        {conversations.length === 0 && (
          <p className="text-sm text-gray-500">Aún no tienes mensajes</p>
        )}

        <div className="space-y-2">
          {conversations.map((c) => {
            const active =
              Number(c.otherUserId) === Number(withUser) &&
              Number(c.taskId) === Number(taskId);

            return (
              <button
                key={c.id}
                onClick={() => {
                  router.push(
                    `/student/messages?with=${c.otherUserId}&task=${c.taskId}`
                  );
                  setShowChatMobile(true); // 📱 abrir chat
                }}
                className={`w-full p-3 text-left rounded-lg transition ${
                  active
                    ? "bg-indigo-100 border border-indigo-300 shadow-sm"
                    : "hover:bg-gray-200"
                }`}
              >
                <p className="font-semibold">{c.otherUserName}</p>
                <p className="text-[11px] text-gray-500 truncate">
                  {c.taskTitle} — <span className="italic">{c.lastMessage}</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 💬 PANEL DEL CHAT */}
      <div
        className={`
          col-span-2 flex flex-col
          ${!showChatMobile ? "hidden md:flex" : "flex"}
        `}
      >
        {!withUser || !taskId ? (
          <p className="p-10 text-gray-500">Selecciona una conversación</p>
        ) : (
          <>
            {/* HEADER DEL CHAT */}
            <div className="border-b bg-white p-4 shadow-sm flex items-center gap-3">
              
              {/* 🔙 BOTÓN VOLVER — SOLO EN MÓVIL */}
              <button
                onClick={() => setShowChatMobile(false)}
                className="md:hidden p-2 rounded hover:bg-gray-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>

              <div>
                <p className="text-lg font-bold text-gray-900">
                  {otherUser?.name || "Cargando..."}
                </p>

                {task && (
                  <p className="text-sm text-gray-600">
                    Tarea: <span className="font-semibold">{task.title}</span> ·
                    <span className="text-indigo-600 font-semibold ml-1">
                      {task.status}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* MENSAJES */}
            <div className="p-6 flex flex-col space-y-4 bg-white h-[60vh] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm">Aún no hay mensajes…</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`px-4 py-2 rounded-xl max-w-[75%] break-words ${
                      msg.senderId === user.id
                        ? "self-end bg-indigo-100 text-right"
                        : "self-start bg-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}

              <div id="bottom-chat"></div>
            </div>

            {/* INPUT */}
            <div className="p-4 border-t bg-white flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje…"
                className="flex-1 border rounded-xl p-3 bg-gray-100 
                focus:bg-white focus:ring-2 focus:ring-indigo-400 transition"
              />

              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 shadow-md"
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
