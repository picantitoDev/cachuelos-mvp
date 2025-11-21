"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CLIENT" | "STUDENT">("CLIENT");

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4">

      {/* 🔙 BOTÓN FLOTANTE VOLVER */}
      <button
        onClick={() => router.push("/")}
        className="
          fixed top-6 left-6 z-50
          bg-white text-indigo-600
          shadow-lg hover:shadow-xl
          w-11 h-11 flex items-center justify-center
          rounded-full border border-indigo-200
          transition-all duration-200
          hover:scale-105
        "
      >
        <ArrowLeft size={22} />
      </button>

      {/* CARD */}
      <Card className="w-full max-w-md shadow-lg border-indigo-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-indigo-600">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* TABS */}
          <div className="grid grid-cols-2 bg-indigo-50 rounded-lg p-1">
            <button
              onClick={() => setRole("CLIENT")}
              className={`py-2 rounded-md text-sm font-medium transition
                ${role === "CLIENT" ? "bg-white shadow text-indigo-600" : "text-gray-600"}
              `}
            >
              Cliente
            </button>

            <button
              onClick={() => setRole("STUDENT")}
              className={`py-2 rounded-md text-sm font-medium transition
                ${role === "STUDENT" ? "bg-white shadow text-indigo-600" : "text-gray-600"}
              `}
            >
              Estudiante
            </button>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="email@ejemplo.com" />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Contraseña</label>
            <Input type="password" placeholder="••••••••" />
          </div>

          {/* FORGOT PASSWORD */}
          <button className="text-sm text-indigo-600 hover:underline text-right w-full">
            Olvidé mi contraseña
          </button>

          {/* LOGIN BUTTON */}
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Iniciar Sesión
          </Button>

          {/* SEPARADOR */}
          <div className="border-t pt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-indigo-600 hover:underline font-medium"
              >
                Crear cuenta
              </button>
            </p>
          </div>

        </CardContent>
      </Card>
    </section>
  );
}
