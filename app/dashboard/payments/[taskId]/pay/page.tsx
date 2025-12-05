"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentProcessPage() {
  const { taskId } = useParams();
  const router = useRouter();

  const [method, setMethod] = useState("TARJETA");
  const [loading, setLoading] = useState(false);

  async function payNow() {
    setLoading(true);

    const res = await fetch(`/api/payments/${taskId}/pay`, {
      method: "PATCH",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error en el pago");
      setLoading(false);
      return;
    }

    alert("Pago realizado con éxito 🎉");
    router.push("/dashboard"); // regreso al panel del cliente
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow space-y-6">

      <button
        onClick={() => router.back()}
        className="text-indigo-600 hover:text-indigo-700 flex items-center"
      >
        ← Regresar
      </button>

      <h1 className="text-2xl font-bold">Simulador de Pago</h1>

      <p className="text-gray-700">
        Selecciona un método de pago y confirma para iniciar la tarea.
      </p>

      {/* MÉTODOS DE PAGO */}
      <div className="space-y-3">
        {["TARJETA", "YAPE", "PLIN", "TRANSFERENCIA"].map((m) => (
          <label
            key={m}
            className="flex items-center gap-3 border p-4 rounded-xl cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              checked={method === m}
              onChange={() => setMethod(m)}
            />
            {m}
          </label>
        ))}
      </div>

      {/* BOTÓN PAGAR */}
      <button
        onClick={payNow}
        disabled={loading}
        className="bg-indigo-600 text-white w-full py-3 rounded-xl hover:bg-indigo-700"
      >
        {loading ? "Procesando..." : "Pagar ahora"}
      </button>
    </div>
  );
}
