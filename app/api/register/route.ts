import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { UserRole, University } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, role, skills, university } = await req.json();

    // Validación SOLO para estudiantes
    if (role === "STUDENT" && !email.endsWith("@upao.edu.pe")) {
      return NextResponse.json(
        { error: "Correo inválido. Usa tu correo institucional @upao.edu.pe" },
        { status: 400 }
      );
    }

    // Validación para evitar que un CLIENT mande universidad por error
    const finalUniversity =
      role === "STUDENT" ? university : "NONE"; // ENUM FIX

    // Verificar si ya existe
    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Crear usuario nuevo
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phone,
        role: role as UserRole,
        university: finalUniversity as University,
        skills: skills || [],
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
