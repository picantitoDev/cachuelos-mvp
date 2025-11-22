"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Wallet, CalendarDays } from "lucide-react";

export default function StudentExploreTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public-tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explorar Tareas</h1>

      {/* filtros arriba... (no los toco) */}

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No hay tareas disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border rounded-lg p-5 shadow hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/student/tasks/${task.id}`)}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {task.title}
              </h2>

              <p className="text-sm text-indigo-600 mt-1">{task.category}</p>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> {task.location}
                </p>

                <p className="flex items-center gap-2">
                  <Wallet size={16} className="text-indigo-600" />
                  Estimado: <span className="font-semibold">S/{task.budget}</span>
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {new Date(task.createdAt).toLocaleDateString()}
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
