"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  MapPin,
  Calendar,
  BadgeDollarSign,
  Filter,
} from "lucide-react";

export default function StudentExploreTasks() {
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --------------------------
  // Cargar tareas publicadas
  // --------------------------
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch("/api/tasks?status=PUBLICADA");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
      setLoading(false);
    }

    loadTasks();
  }, []);

  if (loading) return <p className="text-gray-600">Cargando...</p>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Explorar Tareas</h1>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-xl shadow border">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Categoría</label>
          <select className="border rounded-lg px-3 py-2">
            <option value="">Todas las categorías</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Ubicación / Distrito</label>
          <select className="border rounded-lg px-3 py-2">
            <option value="">Todas las ubicaciones</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Fecha</label>
          <select className="border rounded-lg px-3 py-2">
            <option value="">Cualquier fecha</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Ordenar por</label>
          <select className="border rounded-lg px-3 py-2">
            <option value="">Más recientes</option>
            <option value="">Más antiguos</option>
          </select>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {tasks.length === 0 && (
          <p className="text-gray-500 col-span-3">
            No hay tareas disponibles en este momento.
          </p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
          >
            {/* Categoría */}
            <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-3">
              {task.category || "General"}
            </span>

            {/* Título */}
            <h3 className="font-bold text-lg text-gray-900">{task.title}</h3>

            {/* Descripción corta */}
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {task.description}
            </p>

            {/* Datos */}
            <div className="mt-4 space-y-2 text-sm">

              <p className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} className="text-indigo-600" />
                {task.location}
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} className="text-indigo-600" />
                {new Date(task.created_at).toLocaleDateString("es-PE")}
              </p>

              <p className="flex items-center gap-2 text-gray-700">
                <BadgeDollarSign size={16} className="text-indigo-600" />
                S/ {task.budget}
              </p>
            </div>

            {/* Botón */}
            <button
              onClick={() => router.push(`/student/tasks/${task.id}`)}
              className="mt-5 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
