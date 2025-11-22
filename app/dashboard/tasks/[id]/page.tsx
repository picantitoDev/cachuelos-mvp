"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MapPin,
  Wallet,
  ClipboardList,
  ArrowLeft,
  CalendarDays,
  User,
} from "lucide-react";

export default function TaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // ID de la tarea desde la URL

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtener tarea desde la API
  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        const data = await res.json();
        setTask(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    loadTask();
  }, [id]);

  if (loading) return <p className="p-10">Cargando…</p>;

  if (!task)
    return <p className="p-10 text-red-600">Tarea no encontrada.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* BOTÓN REGRESAR */}
      <button
        onClick={() => router.push("/dashboard/tasks")}
        className="flex items-center gap-2 text-indigo-600 hover:underline mb-4"
      >
        <ArrowLeft size={18} />
        Regresar
      </button>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>

      {/* CARD PRINCIPAL */}
      <div className="bg-white shadow rounded-xl border p-6 space-y-6">

        {/* Categoría y Estado */}
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
            {task.category}
          </span>

          <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 font-medium">
            {task.status}
          </span>
        </div>

        {/* INFO PRINCIPAL */}
        <div className="space-y-3 text-gray-700 text-sm">

          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-indigo-500" />
            <span className="font-medium">Ubicación:</span> {task.location}
          </p>

          <p className="flex items-center gap-2">
            <Wallet size={18} className="text-indigo-500" />
            <span className="font-medium">Estimado:</span> S/{task.budget}
          </p>

          {task.scheduledAt && (
            <p className="flex items-center gap-2">
              <CalendarDays size={18} className="text-indigo-500" />
              <span className="font-medium">Programado:</span>{" "}
              {new Date(task.scheduledAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Descripción</h3>
          <p className="text-gray-700 leading-relaxed">
            {task.description}
          </p>
        </div>

      </div>

      {/* FUTURO: LISTA DE POSTULANTES */}
      <div className="bg-white shadow rounded-xl border p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-3">
          Postulantes (pronto)
        </h3>
        <p className="text-gray-500 text-sm">
          Aquí aparecerán los estudiantes que postulen a tu tarea.
        </p>
      </div>
    </div>
  );
}
