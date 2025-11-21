import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, UserCheck, Handshake, Mail, Briefcase, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="w-full py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* TITLE */}
        <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-900">
          ¿Cómo funciona?
        </h2>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-14">
          
          {/* CLIENT SECTION */}
          <div>
            <h3 className="text-2xl font-bold text-indigo-600 mb-6">Para Clientes</h3>

            <div className="grid gap-6">
              {/* STEP 1 */}
              <Card className="border-indigo-200 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <ClipboardList className="w-10 h-10 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-lg">1. Publica tu tarea</h4>
                    <p className="text-gray-600 text-sm">Describe qué necesitas y agrega fotos si es necesario.</p>
                  </div>
                </CardContent>
              </Card>

              {/* STEP 2 */}
              <Card className="border-indigo-200 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <UserCheck className="w-10 h-10 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-lg">2. Elige al estudiante</h4>
                    <p className="text-gray-600 text-sm">Revisa perfiles, estrellas y propuestas.</p>
                  </div>
                </CardContent>
              </Card>

              {/* STEP 3 */}
              <Card className="border-indigo-200 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <Handshake className="w-10 h-10 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-lg">3. Paga y califica</h4>
                    <p className="text-gray-600 text-sm">Usa un pago seguro y califica el servicio.</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* STUDENT SECTION */}
          <div>
            <h3 className="text-2xl font-bold text-indigo-600 mb-6">Para Estudiantes</h3>

            <div className="grid gap-6">
              {/* STEP 1 */}
              <Card className="border-indigo-200 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <Mail className="w-10 h-10 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-lg">1. Verifica tu correo</h4>
                    <p className="text-gray-600 text-sm">Solo estudiantes UPAO pueden aplicar.</p>
                  </div>
                </CardContent>
              </Card>

              {/* STEP 2 */}
              <Card className="border-indigo-200 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <Briefcase className="w-10 h-10 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-lg">2. Aplica a tareas</h4>
                    <p className="text-gray-600 text-sm">Encuentra tareas según tu habilidad.</p>
                  </div>
                </CardContent>
              </Card>

              {/* STEP 3 */}
              <Card className="border-indigo-200 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <CheckCircle2 className="w-10 h-10 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-lg">3. Gana dinero</h4>
                    <p className="text-gray-600 text-sm">Completa la tarea y recibe tu pago.</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
