"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StudentPricePage() {
  const { taskId } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/payments/${taskId}`);
      const data = await res.json();

      if (res.ok) {
        setPayment(data);
      } else {
        console.error(data);
      }

      setLoading(false);
    }

    load();
  }, [taskId]);

  if (loading) return <p className="p-10">Cargando...</p>;
  if (!payment) return <p className="p-10 text-red-600">No encontrado</p>;

  const { task, proposedPrice, priceStatus } = payment;

  // ============================================
  // ACEPTAR PRECIO
  // ============================================
  async function acceptPrice() {
    const res = await fetch(`/api/payments/${taskId}/price/accept`, {
      method: "PATCH",
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);
    alert("Has aceptado el precio");

    setPayment(data.payment);
  }

  // ============================================
  // RECHAZAR PRECIO
  // ============================================
  async function rejectPrice() {
    const res = await fetch(`/api/payments/${taskId}/price/reject`, {
      method: "PATCH",
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);
    alert("Has rechazado la propuesta");

    setPayment(data.payment);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-6">

      {/* Regresar */}
      <button
        onClick={() => router.back()}
        className="text-indigo-600 hover:text-indigo-700 flex items-center"
      >
        ← Regresar
      </button>

      <h1 className="text-2xl font-bold">Negociación de Precio</h1>

      <p className="text-lg font-semibold">{task?.title}</p>
      <p className="text-gray-600 text-sm">{task?.description}</p>

      <div className="p-4 bg-yellow-50 rounded-xl">
        <p className="font-medium text-yellow-800">
          Propuesta del cliente: S/ {proposedPrice}
        </p>
      </div>

      {priceStatus === "PROPUESTO" && (
        <div className="flex gap-4">
          <button
            onClick={acceptPrice}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl"
          >
            Aceptar precio
          </button>

          <button
            onClick={rejectPrice}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl"
          >
            Rechazar
          </button>
        </div>
      )}

      {priceStatus === "ACEPTADO" && (
        <p className="p-3 bg-green-50 text-green-700 rounded-xl">
          ✔ Precio aceptado. La tarea está en progreso.
        </p>
      )}

      {priceStatus === "RECHAZADO" && (
        <p className="p-3 bg-red-50 text-red-700 rounded-xl">
          ❌ Has rechazado la propuesta. El cliente enviará un nuevo precio.
        </p>
      )}
    </div>
  );
}
