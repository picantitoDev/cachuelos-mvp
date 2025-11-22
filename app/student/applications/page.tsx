"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Clock, MapPin, Wallet } from "lucide-react";

export default function StudentApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  // -----------------------------
  // 1. Cargar estudiante logueado
  // -----------------------------
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      router.push("/login");
      return;
    }
    setStudent(JSON.parse(u));
  }, [router]);

  // -----------------------------
  // 2. Cargar postulaciones del estudiante
  // -----------------------------
  useEffect(() => {
    if (!student) return;

    async function loadApplications() {
      try {
        const res = await fetch(`/api/applications?studentId=${student.id}`);
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    loadApplications();
  }, [student]);

  if (!student) return <p>Cargando…</p>;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-extrabold text-gray-900">
        Mis postulaciones
      </h1>

      {loading ? (
        <p className="text-gray-500">Cargando postulaciones…</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">Aún no te has postulado a ninguna tarea.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((ap) => (
            <div
              key={ap.id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col gap-4"
            >
              {/* Título y categoría */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {ap.task.title}
                </h2>
                <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {ap.task.category}
                </span>
              </div>

              {/* Datos */}
              <div className="text-sm text-gray-600 space-y-2">

                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-600" />
                  {ap.task.location}
                </p>

                <p className="flex items-center gap-2">
                  <Wallet size={16} className="text-indigo-600" />
                  Estimado:{" "}
                  <span className="font-semibold">S/{ap.task.budget}</span>
                </p>

                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  Postulado:{" "}
                  <span>{new Date(ap.createdAt).toLocaleDateString()}</span>
                </p>

                <p className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-indigo-600" />
                  Estado:{" "}
                  <span className="font-semibold text-gray-900">
                    {ap.status}
                  </span>
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  onClick={() => router.push(`/student/tasks/${ap.taskId}`)}
                  className="text-indigo-600 text-sm hover:underline font-medium"
                >
                  Ver tarea
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
