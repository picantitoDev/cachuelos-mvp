import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Faltan datos requeridos." },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // Verificar contraseña actual
    if (user.password !== currentPassword) {
      return NextResponse.json(
        { error: "La contraseña actual es incorrecta." },
        { status: 400 }
      );
    }

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: newPassword },
    });

    return NextResponse.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (err) {
    console.error("PASSWORD UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
