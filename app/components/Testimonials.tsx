import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "María López",
    comment:
      "Encontré un estudiante que me ayudó a pintar mi sala en un día. Súper responsable, recomendado.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", // mujer joven
  },
  {
    name: "José Gutiérrez",
    comment:
      "Coordiné una mudanza pequeña con un estudiante de ingeniería. Trabajo impecable.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", // hombre con lentes
  },
  {
    name: "Ana Castillo",
    comment:
      "Me armaron mis muebles rápido y sin complicaciones. Excelente servicio.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", // mujer latina
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="w-full py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
          Lo que dicen nuestros usuarios
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="border-indigo-200 shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">

                {/* Foto */}
                <div className="w-20 h-20 relative rounded-full overflow-hidden">
                  <Image
                    src={t.img}
                    alt={t.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Estrellas */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                  ))}
                </div>

                {/* Comentario */}
                <p className="text-gray-600 leading-relaxed">{t.comment}</p>

                {/* Nombre */}
                <p className="font-bold text-gray-800">{t.name}</p>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
