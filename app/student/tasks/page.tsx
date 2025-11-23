"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Wallet, CalendarDays } from "lucide-react";

export default function StudentExploreTasks() {
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("");

  // ================================
  // 1. Cargar tareas publicadas
  // ================================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public-tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error loading public tasks:", error);
      }
      setLoading(false);
    }

    load();
  }, []);

  // ================================
  // 2. Aplicar filtros
  // ================================
  const filteredTasks = tasks.filter((task) => {
    if (categoryFilter && task.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-gray-900">Explorar Tareas</h1>

      {/* ===========================
          FILTROS
      ============================ */}
      <div className="w-full bg-white border rounded-xl shadow p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Categoría */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 h-11 text-sm"
            >
              <option value="">Todas las categorías</option>
              <option value="LIMPIEZA">Limpieza</option>
              <option value="MUEBLES">Muebles</option>
              <option value="PINTURA">Pintura</option>
              <option value="DELIVERY">Delivery</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="OTROS">Otros</option>
            </select>
          </div>

          {/* Ubicación */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Ubicación / Distrito</label>
            <select className="border rounded-lg px-3 py-2 h-11 text-sm" disabled>
              <option>Todas las ubicaciones</option>
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha</label>
            <select className="border rounded-lg px-3 py-2 h-11 text-sm" disabled>
              <option>Cualquier fecha</option>
            </select>
          </div>

          {/* Ordenar */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Ordenar por</label>
            <select className="border rounded-lg px-3 py-2 h-11 text-sm" disabled>
              <option>Más recientes</option>
              <option>Más antiguos</option>
            </select>
          </div>

        </div>
      </div>

      {/* ===========================
          LISTADO DE TAREAS
      ============================ */}
      {loading ? (
        <p className="text-gray-500 mt-6">Cargando...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500 mt-6">No hay tareas disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(`/student/tasks/${task.id}`)}
              className="bg-white border rounded-lg p-5 shadow hover:shadow-md transition cursor-pointer"
            >
              {/* Título */}
              <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>

              {/* Categoría */}
              <p className="text-sm text-indigo-600 mt-1">{task.category}</p>

              {/* Info */}
              <div className="mt-3 space-y-2 text-sm text-gray-600">

                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-600" /> {task.location}
                </p>

                <p className="flex items-center gap-2">
                  <Wallet size={16} className="text-indigo-600" />
                  Estimado: <span className="font-semibold">S/{task.budget}</span>
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-indigo-600" />
                  {new Date(task.createdAt).toLocaleDateString("es-PE")}
                </p>
              </div>

              <button className="mt-4 text-indigo-600 hover:underline font-medium">
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
