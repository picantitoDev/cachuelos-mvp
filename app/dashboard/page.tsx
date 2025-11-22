"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, PlusCircle, UserCheck, Briefcase } from "lucide-react";

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(u);
    setUser(parsed);

    // cargar cantidad de tareas reales
    fetch(`/api/tasks?clientId=${parsed.id}`)
      .then((r) => r.json())
      .then((data) => setTaskCount(data.length));
  }, [router]);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold text-gray-800">
        Hola, {user.name}! 👋
      </h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow p-6 rounded-lg flex items-center gap-4 border">
          <ClipboardList className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Tareas creadas</p>
            <p className="text-2xl font-bold">{taskCount}</p>
          </div>
        </div>

        <div className="bg-white shadow p-6 rounded-lg flex items-center gap-4 border">
          <UserCheck className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Tareas completadas</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        <div
          className="bg-indigo-600 shadow p-6 rounded-lg text-white cursor-pointer flex items-center gap-4 hover:bg-indigo-700"
          onClick={() => router.push("/dashboard/tasks/new")}
        >
          <PlusCircle className="w-10 h-10" />
          <div>
            <p className="text-xl font-semibold">Crear nueva tarea</p>
            <p className="text-sm text-indigo-200">Publica una necesidad</p>
          </div>
        </div>

      </div>

      {/* Sección reciente */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Últimas tareas creadas
        </h2>

        <p className="text-gray-500">
          (Aquí luego pondremos un listado pequeño de las últimas 1–3 tareas.)
        </p>
      </div>

    </div>
  );
}
