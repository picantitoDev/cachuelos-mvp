import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// ======================================================
//  GET /api/users/[id]
// ======================================================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user id" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        role: true,
        university: true,
        skills: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("USER GET ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ======================================================
//  DELETE /api/users/[id]
//  Elimina usuario + toda su data relacionada
// ======================================================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ===========================================
    // 1️⃣ Eliminar mensajes enviados y recibidos
    // ===========================================
    await prisma.message.deleteMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    // ===========================================
    // 2️⃣ Eliminar postulaciones
    // ===========================================
    await prisma.application.deleteMany({
      where: { studentId: userId },
    });

    // ===========================================
    // 3️⃣ Eliminar tareas creadas por este cliente
    //    Esto automáticamente borra payment, reviews, messages del task
    // ===========================================
    await prisma.task.deleteMany({
      where: { clientId: userId },
    });

    // ===========================================
    // 4️⃣ Eliminar pagos donde participa
    // ===========================================
    await prisma.payment.deleteMany({
      where: {
        OR: [{ clientId: userId }, { studentId: userId }],
      },
    });

    // ===========================================
    // 5️⃣ Eliminar reviews donde participó
    // ===========================================
    await prisma.review.deleteMany({
      where: {
        OR: [{ authorId: userId }, { targetId: userId }],
      },
    });

    // ===========================================
    // 6️⃣ Eliminar usuario
    // ===========================================
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Usuario y toda su información fueron eliminados correctamente.",
    });
  } catch (error) {
    console.error("USER DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
