"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(undefined); // <-- empieza como undefined
  const [loading, setLoading] = useState(true);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");

    if (!u) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(u));
    setLoading(false);
  }, [router]);

  // ⛔ Mientras carga user, no renderizar nada
  if (loading || !user) {
    return <p className="p-10 text-gray-500">Cargando configuración...</p>;
  }

  async function handlePasswordChange() {
    if (!currentPassword || !newPassword || !confirmNew) {
      alert("Completa todos los campos.");
      return;
    }

    if (newPassword !== confirmNew) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const res = await fetch(`/api/users/${user.id}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al cambiar contraseña");
      return;
    }

    alert("Contraseña actualizada con éxito");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNew("");
  }

  async function handleDeleteAccount() {
    const res = await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Error al eliminar la cuenta");
      return;
    }

    localStorage.removeItem("user");

    alert("Cuenta eliminada correctamente");
    router.push("/");
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded-xl border space-y-10">

      <h1 className="text-3xl font-bold text-indigo-600">Configuración</h1>

      {/* Cambiar contraseña */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cambiar contraseña</h2>

        <Input
          type="password"
          placeholder="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmNew}
          onChange={(e) => setConfirmNew(e.target.value)}
        />

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handlePasswordChange}
        >
          Guardar contraseña
        </Button>
      </section>

      {/* Zona peligrosa */}
      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xl font-semibold text-red-600">Zona peligrosa</h2>

        <p className="text-gray-600 text-sm">Esta acción es permanente.</p>

        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setShowConfirmDelete(true)}
        >
          Eliminar mi cuenta
        </Button>
      </section>

      {/* Modal de confirmación */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4">

            <h2 className="text-lg font-bold text-red-600">
              ¿Seguro que deseas eliminar tu cuenta?
            </h2>

            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancelar
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteAccount}
              >
                Sí, eliminar
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
