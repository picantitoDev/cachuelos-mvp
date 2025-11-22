"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, BadgeDollarSign, Calendar } from "lucide-react";

export default function StudentTaskDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // -----------------------------
  // Obtener detalle de la tarea
  // -----------------------------
  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/tasks/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Error loading task:", data.error);
          return;
        }

        setTask(data);
      } catch (err) {
        console.error("Error:", err);
      }
      setLoading(false);
    }

    loadTask();
  }, [params.id]);

  if (loading) return <p className="text-gray-600">Cargando...</p>;
  if (!task) return <p className="text-red-600">Tarea no encontrada.</p>;

  // -----------------------------
  // Postular a tarea
  // -----------------------------
  async function handleApply() {
    setApplying(true);

    const user = localStorage.getItem("user");
    if (!user) {
      alert("Debes iniciar sesión.");
      router.push("/login");
      return;
    }

    const { id: studentId } = JSON.parse(user);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          studentId,
          message: "Estoy interesado en ayudar con esta tarea.",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo postular.");
      } else {
        alert("Postulación enviada correctamente.");
        router.push("/student/applications");
      }
    } catch (err) {
      alert("Error al postular.");
      console.error(err);
    }

    setApplying(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Regresar */}
      <button
        onClick={() => router.back()}
        className="text-indigo-600 hover:underline text-sm"
      >
        ← Regresar
      </button>

      {/* Tarjeta principal */}
      <div className="bg-white border rounded-xl shadow p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        </div>

        {/* Detalles */}
        <div className="space-y-2 text-gray-700">
          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-indigo-600" />
            {task.location}
          </p>

          <p className="flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600" />
            Publicada: {new Date(task.createdAt).toLocaleDateString("es-PE")}
          </p>

          <p className="flex items-center gap-2">
            <BadgeDollarSign size={18} className="text-indigo-600" />
            Presupuesto: <span className="font-semibold">S/ {task.budget}</span>
          </p>
        </div>

        {/* Descripción */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
        </div>

        {/* Botón Postular */}
        <button
          onClick={handleApply}
          disabled={applying}
          className="bg-indigo-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
        >
          {applying ? "Enviando..." : "Postular"}
        </button>
      </div>

      {/* Postulantes */}
      <div className="bg-white border rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Postulantes (pronto)</h2>
        <p className="text-gray-600 text-sm">
          Aquí verás los estudiantes que postulan a esta tarea.
        </p>
      </div>
    </div>
  );
}
