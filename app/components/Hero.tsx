"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section
      id="hero"
      className="w-full py-32 bg-gradient-to-b from-indigo-50/60 to-white"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-6xl font-black text-gray-900 leading-tight tracking-tight mb-8">
          Conecta con{" "}
          <span className="text-indigo-600">estudiantes verificados</span>
          <br />
          para resolver tus{" "}
          <span className="text-indigo-600">cachuelos</span>
        </h1>

        {/* SUBTÍTULO */}
        <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
          Publica lo que necesitas o gana dinero ofreciendo tus habilidades.
          Una plataforma segura, rápida y confiable para todos.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap justify-center gap-5">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition"
            onClick={() => router.push("/publicar")}
          >
            Publicar tarea
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-100 px-8 py-6 text-lg rounded-xl transition shadow-sm"
            onClick={() => router.push("/ganar-dinero")}
          >
            Ganar dinero
          </Button>
        </div>
      </div>
    </section>
  );
}
