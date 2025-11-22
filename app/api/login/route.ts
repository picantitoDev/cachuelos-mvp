import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Buscar al usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Comparar password directo (sin hashing)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 400 }
      );
    }

    // Respuesta OK → Mandamos información útil del usuario
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      university: user.university,
      photoUrl: user.photoUrl,
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
