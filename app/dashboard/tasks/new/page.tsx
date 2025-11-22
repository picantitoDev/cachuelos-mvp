"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.location || !form.budget) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setLoading(true);

    const res = await fetch("/api/tasks", {   //  <-- CORREGIDO
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        budget: parseFloat(form.budget),
        clientId: user?.id,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Error al crear la tarea");
      return;
    }

    alert("Tarea creada con éxito");
    router.push("/dashboard/tasks");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Publicar nueva tarea</h1>

      <div className="space-y-5">

        <div>
          <label className="text-sm font-medium">Título *</label>
          <Input
            name="title"
            placeholder="Ej: Armado de escritorio"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descripción *</label>
          <Textarea
            name="description"
            placeholder="Describe lo que necesitas…"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Categoría *</label>
          <Select onValueChange={(value) => setForm({ ...form, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LIMPIEZA">Limpieza</SelectItem>
              <SelectItem value="MUEBLES">Armado de muebles</SelectItem>
              <SelectItem value="PINTURA">Pintura</SelectItem>
              <SelectItem value="DELIVERY">Delivery</SelectItem>
              <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
              <SelectItem value="OTROS">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Ubicación *</label>
          <Input
            name="location"
            placeholder="Miraflores, Lima"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Presupuesto estimado (S/.) *</label>
          <Input
            name="budget"
            type="number"
            placeholder="Ej: 50"
            value={form.budget}
            onChange={handleChange}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 w-full text-white mt-4"
        >
          {loading ? "Publicando..." : "Publicar tarea"}
        </Button>

      </div>
    </div>
  );
}
