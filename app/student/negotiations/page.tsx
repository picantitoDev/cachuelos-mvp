"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NegotiationsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        console.error("No se encontró usuario en localStorage");
        return;
      }

      const user = JSON.parse(userRaw);
      const studentId = user.id;

      const res = await fetch(`/api/student/negotiations?studentId=${studentId}`);
      const data = await res.json();

      if (res.ok) {
        setItems(data.negotiations);
      } else {
        console.error(data);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p className="p-10">Cargando…</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow space-y-6">

      <h1 className="text-2xl font-bold text-gray-900">Negociaciones pendientes</h1>

      {items.length === 0 && (
        <p className="text-gray-600">No tienes negociaciones activas.</p>
      )}

      {items.map((pago) => (
        <div
          key={pago.id}
          className="p-4 border rounded-xl bg-gray-50 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{pago.task?.title ?? "Tarea desconocida"}</p>

            <p className="text-sm text-gray-600">
              Cliente: {pago.client?.name ?? "Cliente desconocido"}
            </p>

            <p className="text-sm text-indigo-600 font-medium">
              Propuesta: S/ {pago.proposedPrice ?? 0}
            </p>
          </div>

          <Link
            href={`/student/negotiations/${pago.taskId}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Ver negociación
          </Link>
        </div>
      ))}
    </div>
  );
}
