"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const { taskId } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposedPrice, setProposedPrice] = useState("");

  // =====================================================
  // 1) Cargar Payment (incluye Task + Student)
  // =====================================================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/payments/${taskId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          return;
        }

        setPayment(data);
      } catch (e) {
        console.error("ERROR PAYMENT PAGE:", e);
      }

      setLoading(false);
    }

    load();
  }, [taskId]);

  if (loading) return <p className="p-10">Cargando…</p>;
  if (!payment)
    return <p className="p-10 text-red-600">No se encontró información de pago.</p>;

  const {
    priceFinal,
    commission,
    totalAmount,
    priceStatus,
    proposedPrice: storedProposal,
    task,
    student,
  } = payment;

  // =====================================================
  // Estudiante asignado
  // =====================================================
  const selectedStudent =
    student?.name || task?.assignedTo?.name || "Estudiante seleccionado";

  // =====================================================
  // 2) Enviar propuesta de precio
  // =====================================================
  async function sendPriceProposal() {
    const res = await fetch(`/api/payments/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposedPrice: Number(proposedPrice) }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al enviar propuesta");
      return;
    }

    alert("Propuesta enviada con éxito");
    setPayment(data.payment);
  }

  // =====================================================
  // 3) UI según estado del precio
  // =====================================================
  const renderPriceSection = () => {
    if (priceStatus === "SIN_PROPUESTA") {
      return (
        <>
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
            Estado del precio: <b>SIN PROPUESTA</b>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Proponer nuevo precio</label>
            <input
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              type="number"
              className="border p-3 rounded-xl w-full"
              placeholder="Ej. 50"
            />

            <button
              onClick={sendPriceProposal}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
            >
              Enviar propuesta
            </button>
          </div>
        </>
      );
    }

    if (priceStatus === "PROPUESTO") {
      return (
        <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
          <p className="font-medium">Propuesta enviada: S/ {storedProposal}</p>
          <p className="text-sm text-gray-600">
            Esperando respuesta del estudiante…
          </p>
        </div>
      );
    }

    if (priceStatus === "ACEPTADO") {
      return (
        <div className="space-y-4 mt-6">
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="font-medium text-green-800">
              Precio final acordado: S/ {priceFinal}
            </p>
            <p className="text-sm text-gray-600">
              El estudiante aceptó la propuesta. Procede con el pago para iniciar la
              tarea.
            </p>
          </div>

          <button
  onClick={() => router.push(`/dashboard/payments/${taskId}/pay`)}
  className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
>
  Proceder al pago
</button>

        </div>
      );
    }

    return null;
  };

  // =====================================================
  // RENDER PRINCIPAL
  // =====================================================
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
      {/* 🔙 BOTÓN REGRESAR */}
      <button
        onClick={() => router.push(`/dashboard/tasks/${taskId}`)}
        className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition mb-2"
      >
        <span className="mr-2 text-xl">←</span>
        Regresar
      </button>

      <h1 className="text-2xl font-bold text-gray-900">Negociación del Precio</h1>

      {/* Info de la tarea */}
      <div>
        <p className="text-lg font-semibold">{task?.title}</p>
        <p className="text-gray-600 text-sm">{task?.description}</p>
      </div>

      {/* Estudiante seleccionado */}
      <div className="border p-4 rounded-xl bg-gray-50 space-y-1">
        <p className="font-semibold">{selectedStudent}</p>
        <p className="text-sm text-gray-600">Estudiante seleccionado</p>
      </div>

      {/* UI dinámica según estado */}
      {renderPriceSection()}
    </div>
  );
}