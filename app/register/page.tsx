"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"CLIENT" | "STUDENT">("CLIENT");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
    university: "UPAO",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg(""); // limpiar error
  };

  const handleRegister = async () => {
    setErrorMsg("");

    // ⛔ Validación frontal para estudiantes
    if (role === "STUDENT" && !form.email.endsWith("@upao.edu.pe")) {
      setErrorMsg("Debes usar un correo institucional @upao.edu.pe");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        role,
        university: role === "STUDENT" ? form.university : "NONE",
        skills:
          role === "STUDENT"
            ? form.skills.split(",").map((s) => s.trim())
            : [],
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setErrorMsg(data.error || "Error al registrarse");
      return;
    }

    alert("Cuenta creada con éxito");
    router.push("/login");
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4">

      {/* BOTÓN VOLVER */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-50 bg-white text-indigo-600 shadow-lg hover:shadow-xl 
                   w-11 h-11 flex items-center justify-center rounded-full 
                   border border-indigo-200 transition-all hover:scale-105"
      >
        <ArrowLeft size={22} />
      </button>

      <Card className="w-full max-w-md shadow-lg border-indigo-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-indigo-600">
            Crear Cuenta
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* TABS */}
          <div className="grid grid-cols-2 bg-indigo-50 rounded-lg p-1">
            {["CLIENT", "STUDENT"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r as any)}
                className={`py-2 rounded-md text-sm font-medium transition 
                ${role === r ? "bg-white shadow text-indigo-600" : "text-gray-600"}`}
              >
                {r === "CLIENT" ? "Cliente" : "Estudiante"}
              </button>
            ))}
          </div>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <p className="text-red-600 text-sm font-medium text-center">
              {errorMsg}
            </p>
          )}

          {/* NAME */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nombre completo</label>
            <Input
              name="name"
              placeholder="Juan Pérez"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              placeholder="email@ejemplo.com"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Contraseña</label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* PHONE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Teléfono</label>
            <Input
              name="phone"
              placeholder="987 123 456"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* SOLO ESTUDIANTE */}
          {role === "STUDENT" && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Universidad</label>
                <Input
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Habilidades</label>
                <Input
                  name="skills"
                  placeholder="Pintura, armado, delivery..."
                  value={form.skills}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* SUBMIT */}
          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </Button>

          {/* LOGIN LINK */}
          <div className="border-t pt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-indigo-600 hover:underline font-medium"
              >
                Iniciar sesión
              </button>
            </p>
          </div>

        </CardContent>
      </Card>
    </section>
  );
}
