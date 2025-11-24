"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function MessagesPage() {
  const params = useSearchParams();
  const router = useRouter();

  const withUser = params.get("with");
  const taskId = params.get("task");

  const [user, setUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [task, setTask] = useState(null);

  // 1️⃣ Usuario logueado
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
  }, []);

  // 2️⃣ Usuario con quien hablo
  useEffect(() => {
    if (!withUser) return;

    async function loadOtherUser() {
      const res = await fetch(`/api/users/${withUser}`);
      const data = await res.json();
      if (!data.error) setOtherUser(data);
    }

    loadOtherUser();
  }, [withUser]);

  // 3️⃣ Cargar tarea
  useEffect(() => {
    if (!taskId) return;

    async function loadTask() {
      const res = await fetch(`/api/tasks/${taskId}`);
      const data = await res.json();
      if (!data.error) setTask(data);
    }

    loadTask();
  }, [taskId]);

  // 4️⃣ Cargar conversaciones
  async function refreshConversations() {
    if (!user?.id) return;

    const res = await fetch(`/api/conversations?userId=${user.id}`);
    const data = await res.json();
    setConversations(data);
  }

  useEffect(() => {
    refreshConversations();
  }, [user]);

  // 5️⃣ Cargar mensajes
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
      refreshConversations();
    }
  }

  return (
    <div className="grid grid-cols-3 min-h-[85vh] bg-white rounded-xl shadow">

      {/* LEFT — Conversaciones */}
      <div className="border-r bg-gray-50 p-4 overflow-y-auto">
        <h2 className="font-bold mb-4 text-gray-800 text-lg">Conversaciones</h2>

        {conversations.length === 0 && (
          <p className="text-gray-500 text-sm">Aún no tienes chats</p>
        )}

        <div className="space-y-2">
          {conversations.map((c) => {
            const isActive =
              Number(c.otherUserId) === Number(withUser) &&
              Number(c.taskId) === Number(taskId);

            return (
              <button
                key={c.id}
                className={`w-full p-3 text-left rounded-lg transition ${
                  isActive
                    ? "bg-indigo-100 border border-indigo-300 shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                onClick={() =>
                  router.push(`/dashboard/messages?with=${c.otherUserId}&task=${c.taskId}`)
                }
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

      {/* RIGHT — Chat */}
      <div className="col-span-2 flex flex-col">

        {!withUser || !taskId ? (
          <p className="p-10 text-gray-500">Selecciona una conversación</p>
        ) : (
          <>
            {/* HEADER */}
            <div className="border-b bg-white p-4 shadow-sm">
              <p className="text-lg font-bold text-gray-900">
                {otherUser ? otherUser.name : "Cargando..."}
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

            {/* MENSAJES — FIX DE SCROLL INTERNO */}
            <div className="p-6 flex flex-col space-y-4 bg-white h-[60vh] overflow-y-auto">

              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm">Inicia la conversación…</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`block px-4 py-2 rounded-xl max-w-[75%] break-words ${
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
            <div className="p-4 border-t bg-white flex items-center gap-3 shadow-inner">
              <input
                className="flex-1 border rounded-xl p-3 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-400 transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje…"
              />
              <button
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 shadow-md transition"
                onClick={sendMessage}
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
