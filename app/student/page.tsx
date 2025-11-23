"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Briefcase, Send, Rocket } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [tasksAvailable, setTasksAvailable] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
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

    const parsed = JSON.parse(u);

    // Si no es estudiante → redirigir a su dashboard cliente
    if (parsed.role !== "STUDENT") {
      router.push("/dashboard");
      return;
    }

    setUser(parsed);
  }, [router]);

  // -------------------------------
  // 2. Cargar número de tareas publicadas
  // -------------------------------
  // -------------------------------
// 2. Cargar número de tareas publicadas
// -------------------------------
useEffect(() => {
  if (!user) return;

  async function loadStats() {
    try {
      // COUNT de tareas publicadas
      const resTasks = await fetch(`/api/public-tasks`);
      const tasksList = await resTasks.json();
      setTasksAvailable(tasksList.length);

      // COUNT de mis postulaciones
      const resApps = await fetch(`/api/applications?studentId=${user.id}`);
      const apps = await resApps.json();
      setApplicationsCount(apps.length);

    } catch (error) {
      console.error("Error loading student stats:", error);
    }

    setLoading(false);
  }

  loadStats();
}, [user]);


  if (!user || loading)
    return <p className="text-gray-600">Cargando...</p>;

  return (
    <div className="space-y-10">

      {/* ENCABEZADO */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Hola, {user.name}!
        </h1>

        <button
          onClick={() => router.push("/student/tasks")}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          Explorar tareas
        </button>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TAREAS DISPONIBLES */}
        <div className="p-6 bg-white shadow rounded-xl border">
          <div className="flex items-center gap-4">
            <Briefcase className="text-indigo-600" size={36} />
            <div>
              <p className="text-sm text-gray-500">Tareas disponibles</p>
              <p className="text-3xl font-bold">{tasksAvailable}</p>
            </div>
          </div>
        </div>

        {/* MIS POSTULACIONES */}
        <div className="p-6 bg-white shadow rounded-xl border">
          <div className="flex items-center gap-4">
            <Send className="text-green-600" size={36} />
            <div>
              <p className="text-sm text-gray-500">Mis postulaciones</p>
              <p className="text-3xl font-bold">{applicationsCount}</p>
            </div>
          </div>
        </div>

      </div>

      {/* CTA: COMENZAR */}
      <div className="p-8 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-indigo-900">
            ¿Listo para encontrar tu próximo cachuelo?
          </h2>
          <p className="text-gray-600 mt-1">
            Explora cientos de tareas publicadas por clientes en tu ciudad.
          </p>
        </div>

        <button
          onClick={() => router.push("/student/tasks")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          <Rocket size={18} />
          Ver tareas
        </button>
      </div>

    </div>
  );
}
