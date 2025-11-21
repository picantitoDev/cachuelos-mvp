"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section id="hero" className="w-full py-28 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Conecta con <span className="text-indigo-600">estudiantes universitarios</span><br />
          verificados para tus <span className="text-indigo-600">cachuelos</span>
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          Encuentra ayuda para cualquier tarea o gana dinero extra ofreciendo tus habilidades.
          Fácil, seguro y confiable.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
            onClick={() => router.push("/publicar")}
          >
            Publicar tarea
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6"
            onClick={() => router.push("/ganar-dinero")}
          >
            Ganar dinero
          </Button>
        </div>

      </div>
    </section>
  );
}
