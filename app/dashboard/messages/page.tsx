"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const params = useSearchParams();

  const withUser = params.get("with");
  const taskId = params.get("task");

  const [user, setUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  // ================================
  // 1️⃣ Cargar usuario logueado
  // ================================
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
  }, []);

  // =======================================
  // 2️⃣ Cargar datos del usuario con quien hablo
  // =======================================
  useEffect(() => {
    if (!withUser) return;

    async function loadOtherUser() {
      const res = await fetch(`/api/users/${withUser}`);
      const data = await res.json();

      if (!data.error) {
        setOtherUser(data);
      }
    }

    loadOtherUser();
  }, [withUser]);

  // =================================
  // 3️⃣ Cargar lista de conversaciones
  // =================================
  useEffect(() => {
    if (!user?.id) return;

    async function loadConversations() {
      const res = await fetch(`/api/conversations?userId=${user.id}`);
      const data = await res.json();
      setConversations(data);
    }

    loadConversations();
  }, [user]);

  // ===============================
  // 4️⃣ Cargar mensajes del chat actual
  // ===============================
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

  // ===============================
  // 5️⃣ Enviar mensaje
  // ===============================
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

  // ===============================
  //  UI
  // ===============================
  return (
    <div className="grid grid-cols-3 h-[85vh] bg-white rounded-xl shadow">

      {/* LEFT COLUMN — Conversaciones */}
      <div className="border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Conversaciones</h2>

        {conversations.length === 0 && (
          <p className="text-gray-500 text-sm">Aún no tienes chats</p>
        )}

        {conversations.map((c) => (
          <button
            key={c.id}
            className="block p-3 w-full text-left hover:bg-gray-100 rounded"
            onClick={() =>
              (window.location.href = `/dashboard/messages?with=${c.otherUserId}&task=${c.taskId}`)
            }
          >
            <p className="font-semibold">{c.otherUserName}</p>
            <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
          </button>
        ))}
      </div>

      {/* RIGHT COLUMN — Chat */}
      <div className="col-span-2 flex flex-col">

        {/* SI AÚN NO SE HA SELECCIONADO CHAT */}
        {!withUser || !taskId ? (
          <p className="p-10 text-gray-500">Selecciona una conversación</p>
        ) : (
          <>

            {/* Header del chat — nombre del usuario */}
            <div className="border-b p-4 font-semibold text-lg bg-gray-50">
              {otherUser ? otherUser.name : "Cargando..."}
            </div>

            {/* Lista de mensajes */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.length === 0 && (
                <p className="text-gray-400 text-sm">Inicia la conversación…</p>
              )}

              {messages.map((msg) => (
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
              ))}
            </div>

            {/* INPUT */}
            <div className="p-4 border-t flex items-center gap-2">
              <input
                className="flex-1 border rounded-lg p-3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje…"
              />
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
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
