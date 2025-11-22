"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  CheckCircle,
  MapPin,
  Wallet,
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
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(u));
  }, [router]);

  // -------------------------------
  // 2. Cargar las últimas tareas
  // -------------------------------
  useEffect(() => {
    if (!user) return;

    async function loadTasks() {
      try {
        const res = await fetch(`/api/tasks?clientId=${user.id}`);
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    loadTasks();
  }, [user]);

  if (!user) return <p>Cargando...</p>;

  const completedTasks = tasks.filter((t) => t.status === "COMPLETADA").length;

  return (
    <div className="space-y-10">

      {/* ENCABEZADO */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Hola, {user.name}!
        </h1>

        <button
          onClick={() => router.push("/dashboard/tasks/new")}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          + Crear nueva tarea
        </button>
      </div>

      {/* TARJETAS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total creadas */}
        <div className="p-6 bg-white shadow rounded-xl border">
          <div className="flex items-center gap-4">
            <ClipboardList className="text-indigo-600" size={36} />
            <div>
              <p className="text-sm text-gray-500">Tareas creadas</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
            </div>
          </div>
        </div>

        {/* Completadas */}
        <div className="p-6 bg-white shadow rounded-xl border">
          <div className="flex items-center gap-4">
            <CheckCircle className="text-green-600" size={36} />
            <div>
              <p className="text-sm text-gray-500">Tareas completadas</p>
              <p className="text-3xl font-bold">{completedTasks}</p>
            </div>
          </div>
        </div>

      </div>

      {/* ÚLTIMAS TAREAS CREADAS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Últimas tareas creadas</h2>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">Aún no has creado tareas.</p>
        ) : (
          <div className="space-y-4">

            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-5 bg-white shadow rounded-lg border flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">{task.category}</p>

                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    {/* Ubicación */}
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-indigo-600 flex-shrink-0" />
                      {task.location}
                    </p>

                    {/* Presupuesto */}
                    <p className="flex items-center gap-2">
                      <Wallet size={16} className="text-indigo-600 flex-shrink-0" />
                      Estimado:
                      <span className="font-semibold"> S/{task.budget}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Ver detalles
                </button>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
