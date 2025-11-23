"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, CalendarDays, Wallet } from "lucide-react";

export default function StudentTaskDetails() {
  const router = useRouter();
  const params = useParams();

  const [task, setTask] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) return router.push("/login");

    const parsed = JSON.parse(u);
    if (parsed.role !== "STUDENT") return router.push("/dashboard");

    setUser(parsed);
  }, []);

  useEffect(() => {
    async function loadTask() {
      const res = await fetch(`/api/tasks/${params.id}`);
      const data = await res.json();
      setTask(data);
    }
    loadTask();
  }, [params.id]);

  // 🔍 Revisar si ya postuló
  useEffect(() => {
    if (!user) return;

    async function checkApplication() {
      const res = await fetch(`/api/applications/check?taskId=${params.id}&studentId=${user.id}`);
      const data = await res.json();
      setHasApplied(data.applied);
    }

    checkApplication();
  }, [user, params.id]);

  if (!task) return <p>Cargando...</p>;

  // -----------------------------
  // POSTULAR
  // -----------------------------
  async function handleApply() {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: task.id,
        studentId: user.id,
        message,
      }),
    });

    if (!res.ok) return alert("Error al postular");

    alert("Postulación enviada");
    setHasApplied(true);
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="text-indigo-600 hover:underline"
      >
        ← Regresar
      </button>

      <h1 className="text-3xl font-bold">{task.title}</h1>

      <p className="text-sm text-indigo-600 font-semibold">{task.category}</p>

      {/* CLIENTE */}
      <p className="text-gray-700 text-sm">
        Publicado por: <span className="font-semibold">{task.client?.name}</span>
      </p>

      <div className="space-y-2 text-gray-700 mt-4">
        <p className="flex items-center gap-2">
          <MapPin size={18} /> {task.location}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays size={18} /> {new Date(task.createdAt).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2">
          <Wallet size={18} /> S/ {task.budget}
        </p>
      </div>

      <p className="mt-4">{task.description}</p>

      {/* SI YA POSTULÓ */}
      {hasApplied ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-6">
          <p className="font-semibold text-green-700">
            Ya postulaste a esta tarea 👍
          </p>
          <button
            onClick={() => router.push("/student/applications")}
            className="mt-3 text-indigo-600 hover:underline"
          >
            Ver mis postulaciones
          </button>
        </div>
      ) : (
        <>
          <textarea
            placeholder="Mensaje opcional para el cliente..."
            className="w-full border rounded-lg p-3 mt-6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={handleApply}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-indigo-700"
          >
            Postularme
          </button>
        </>
      )}
    </div>
  );
}
