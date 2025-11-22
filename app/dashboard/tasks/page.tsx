"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Wallet } from "lucide-react";

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    const { id } = JSON.parse(user);

    async function loadTasks() {
      try {
        const res = await fetch(`/api/tasks?clientId=${id}`);
        const data = await res.json();
        setTasks(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    loadTasks();
  }, [router]);

  if (loading) return <p>Cargando tareas…</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis tareas activas</h1>

        <button
          onClick={() => router.push("/dashboard/tasks/new")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Nueva tarea
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">Aún no has publicado tareas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((t: any) => (
            <div
              key={t.id}
              className="
                bg-white rounded-xl border border-gray-200 shadow-sm 
                hover:shadow-md transition p-6 flex flex-col gap-4
              "
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{t.title}</h2>

                  <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded mt-2 inline-block">
                    {t.category}
                  </span>
                </div>

                {/* STATUS */}
                <span
                  className="
                    px-3 py-1 text-xs rounded-full bg-indigo-50 
                    text-indigo-700 font-medium
                  "
                >
                  {t.status}
                </span>
              </div>

              {/* BODY */}
              <div className="space-y-2 text-sm text-gray-600">
                {/* LOCATION */}
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-600" />
                  {t.location}
                </p>

                {/* BUDGET */}
                <p className="flex items-center gap-2">
                  <Wallet size={16} className="text-indigo-600" />
                  Estimado: <span className="font-semibold text-gray-900">S/ {t.budget}</span>
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <button className="text-indigo-600 font-medium hover:underline text-sm">
                  Ver postulantes
                </button>

                <button
                  onClick={() => router.push(`/dashboard/tasks/${t.id}`)}
                  className="
                    bg-indigo-600 text-white px-3 py-1.5 rounded-md 
                    text-xs hover:bg-indigo-700 transition
                  "
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
