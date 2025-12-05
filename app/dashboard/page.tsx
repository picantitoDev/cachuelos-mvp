"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  CheckCircle,
  MapPin,
  Wallet,
  Plus,
} from "lucide-react";

export default function DashboardClient() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // 1. Cargar usuario
  // -------------------------------
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) return router.push("/login");
    setUser(JSON.parse(u));
  }, [router]);

  // -------------------------------
  // 2. Cargar tareas
  // -------------------------------
  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const res = await fetch(`/api/tasks?clientId=${user.id}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    load();
  }, [user]);

  if (!user) return <p className="p-10">Cargando...</p>;

  const completedTasks = tasks.filter((t) => t.status === "COMPLETADA").length;

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Hola, {user.name}!
        </h1>

        <button
          onClick={() => router.push("/dashboard/tasks/new")}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md"
        >
          + Crear nueva tarea
        </button>
      </div>

      {/* CARDS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total creadas */}
        <div className="p-6 bg-white shadow-lg rounded-xl border hover:shadow-xl transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <ClipboardList size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tareas creadas</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
            </div>
          </div>
        </div>

        {/* Completadas */}
        <div className="p-6 bg-white shadow-lg rounded-xl border hover:shadow-xl transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <CheckCircle size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tareas completadas</p>
              <p className="text-3xl font-bold">{completedTasks}</p>
            </div>
          </div>
        </div>

        {/* Progreso / estadísticas */}
        <div className="p-6 bg-white shadow-lg rounded-xl border hover:shadow-xl transition">
          <p className="text-sm text-gray-500 mb-1">Progreso general</p>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-3 rounded-full"
              style={{
                width:
                  tasks.length > 0
                    ? `${(completedTasks / tasks.length) * 100}%`
                    : "0%",
              }}
            ></div>
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            {completedTasks} de {tasks.length} tareas completadas
          </p>
        </div>
      </div>

      {/* ÚLTIMAS TAREAS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Últimas tareas creadas</h2>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-14 bg-white border rounded-xl shadow-md">
            <p className="text-gray-600 mb-4">
              Aún no has creado tareas. ¿Qué esperas?
            </p>
            <button
              onClick={() => router.push("/dashboard/tasks/new")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              Crear mi primera tarea
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-6 bg-white shadow-lg rounded-xl border flex flex-col sm:flex-row sm:justify-between gap-4 hover:shadow-xl transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">{task.category}</p>

                  {/* Información */}
                  <div className="text-sm text-gray-600 mt-3 space-y-1">

                    {/* Ubicación */}
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-indigo-600" />
                      {task.location}
                    </p>

                    {/* Presupuesto */}
                    <p className="flex items-center gap-2">
                      <Wallet size={16} className="text-indigo-600" />
                      Estimado:
                      <span className="font-semibold"> S/{task.budget}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                  className="text-indigo-600 hover:underline font-medium self-start sm:self-center"
                >
                  Ver detalles →
                </button>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* BOTÓN FLOTANTE EN MÓVIL */}
      <button
        onClick={() => router.push("/dashboard/tasks/new")}
        className="md:hidden fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition"
      >
        <Plus size={26} />
      </button>
    </div>
  );
}
