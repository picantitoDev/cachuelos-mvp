"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer">
          Cachueleando
        </h1>

        {/* MENU CENTRADO */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-10 text-sm font-medium">
            <a href="#hero" className="hover:text-indigo-600 transition">Inicio</a>
            <a href="#como-funciona" className="hover:text-indigo-600 transition">Cómo funciona</a>
            <a href="#categorias" className="hover:text-indigo-600 transition">Categorías</a>
            <a href="#testimonios" className="hover:text-indigo-600 transition">Testimonios</a>
            <a href="#footer" className="hover:text-indigo-600 transition">Contacto</a>
          </div>
        </div>

        {/* BOTONES DERECHA */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="border-indigo-600 text-indigo-600">
            Iniciar sesión
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Publicar tarea
          </Button>
        </div>

        {/* MOBILE BUTTON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden flex flex-col bg-white border-t p-4 space-y-3">
          <a href="#hero" className="text-gray-700">Inicio</a>
          <a href="#como-funciona" className="text-gray-700">Cómo funciona</a>
          <a href="#categorias" className="text-gray-700">Categorías</a>
          <a href="#testimonios" className="text-gray-700">Testimonios</a>
          <a href="#footer" className="text-gray-700">Contacto</a>

          <Button variant="outline" className="border-indigo-600 text-indigo-600 w-full">
            Iniciar sesión
          </Button>

          <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
            Publicar tarea
          </Button>
        </div>
      )}
    </nav>
  );
}
