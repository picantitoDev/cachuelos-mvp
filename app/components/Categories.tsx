import { Card, CardContent } from "@/components/ui/card";
import {
  Brush,
  Paintbrush,
  Package,
  Wrench,
  Trees,
  Dog,
  Truck,
  Printer,
} from "lucide-react";

const categories = [
  { name: "Limpieza", icon: Brush },
  { name: "Pintura", icon: Paintbrush },
  { name: "Mudanzas", icon: Truck },
  { name: "Armado de Muebles", icon: Package },
  { name: "Jardinería", icon: Trees },
  { name: "Mascotas", icon: Dog },
  { name: "Reparaciones", icon: Wrench },
  { name: "Trámites / Delivery", icon: Printer },
];

export default function Categories() {
  return (
    <section id="categorias" className="w-full py-24 bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
          Categorías Populares
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <Card
                key={cat.name}
                className="border-indigo-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <CardContent className="flex flex-col items-center gap-4 py-8">
                  <Icon className="w-10 h-10 text-indigo-600" />
                  <p className="font-medium text-gray-800">{cat.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
