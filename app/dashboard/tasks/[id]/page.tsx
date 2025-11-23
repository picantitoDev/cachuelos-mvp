"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MapPin,
  Wallet,
  ArrowLeft,
  CalendarDays,
  User,
} from "lucide-react";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------
  // CARGAR TAREA + POSTULANTES
  // ------------------------------------------------------
  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        const data = await res.json();
        setTask(data);
      } catch (err) {
        console.error("ERROR LOADING TASK:", err);
      }
      setLoading(false);
    }

    loadTask();
  }, [id]);

  if (loading) return <p className="p-10">Cargando…</p>;
  if (!task) return <p className="p-10 text-red-600">Tarea no encontrada.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* REGRESAR */}
      <button
        onClick={() => router.push("/dashboard/tasks")}
        className="flex items-center gap-2 text-indigo-600 hover:underline mb-4"
      >
        <ArrowLeft size={18} />
        Regresar
      </button>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>

      {/* CARD DE LA TAREA */}
      <div className="bg-white shadow rounded-xl border p-6 space-y-6">

        {/* CATEGORÍA + ESTADO */}
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
            {task.category}
          </span>

          <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 font-medium">
            {task.status}
          </span>
        </div>

        {/* INFORMACIÓN PRINCIPAL */}
        <div className="space-y-3 text-gray-700 text-sm">

          <p className="flex items-center gap-2">
            <MapPin size={18} className="text-indigo-500" />
            <span className="font-medium">Ubicación:</span> {task.location}
          </p>

          <p className="flex items-center gap-2">
            <Wallet size={18} className="text-indigo-500" />
            <span className="font-medium">Estimado:</span> S/{task.budget}
          </p>

          {task.createdAt && (
            <p className="flex items-center gap-2">
              <CalendarDays size={18} className="text-indigo-500" />
              <span className="font-medium">Publicado:</span>{" "}
              {new Date(task.createdAt).toLocaleDateString("es-PE")}
            </p>
          )}
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Descripción</h3>
          <p className="text-gray-700 leading-relaxed">{task.description}</p>
        </div>
      </div>

      {/* POSTULANTES */}
      <div className="bg-white shadow rounded-xl border p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Postulantes
        </h3>

        {task.applications?.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Aún no hay postulantes en esta tarea.
          </p>
        ) : (
          <div className="space-y-4">
            {task.applications.map((app) => (
              <div
                key={app.id}
                className="p-4 border rounded-xl bg-gray-50 space-y-2"
              >
                {/* Nombre */}
                <p className="flex items-center gap-2 font-semibold text-gray-900">
                  <User size={18} className="text-indigo-600" />
                  {app.student.name}
                </p>

                {/* Mensaje de postulación */}
                {app.message && (
                  <p className="text-sm italic text-gray-700">
                    “{app.message}”
                  </p>
                )}

                {/* Estado */}
                <p className="text-sm">
                  Estado:{" "}
                  <span className="font-semibold text-indigo-600">
                    {app.status}
                  </span>
                </p>

                {/* ENVIAR MENSAJE */}
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/messages?with=${app.student.id}&task=${task.id}`
                    )
                  }
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Enviar mensaje
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
