"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    skills: "",
    university: "",
    photoUrl: "",
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
    setForm({
      name: u.name || "",
      phone: u.phone || "",
      skills: u.skills?.join(", ") || "",
      university: u.university || "",
      photoUrl: u.photoUrl || "",
    });
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function saveProfile() {
    alert("🔧 Aún no tienes API para actualizar perfil. Si quieres te la creo.");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-xl border space-y-8">
      <h1 className="text-3xl font-bold text-indigo-600">Mi Perfil</h1>

      {/* FOTO DE PERFIL */}
      <div className="flex flex-col items-center gap-4">
        {form.photoUrl ? (
          <img
            src={form.photoUrl}
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <UserCircle className="w-24 h-24 text-gray-400" />
        )}

        <Input
          name="photoUrl"
          placeholder="URL de foto de perfil"
          value={form.photoUrl}
          onChange={handleChange}
          className="max-w-xs"
        />
      </div>

      {/* FORMULARIO */}
      <div className="space-y-5">

        <div>
          <label className="text-sm font-medium">Nombre completo</label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label className="text-sm font-medium">Teléfono</label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        {user?.role === "STUDENT" && (
          <>
            <div>
              <label className="text-sm font-medium">Universidad</label>
              <Input
                name="university"
                value={form.university}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Habilidades</label>
              <Textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Ej: Pintura, armado, delivery"
              />
            </div>
          </>
        )}
      </div>

      <Button
        onClick={saveProfile}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
        disabled={loading}
      >
        Guardar cambios
      </Button>
    </div>
  );
}
