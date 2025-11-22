import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// ==============================================
// POST → Crear una postulación
// ==============================================
export async function POST(req: Request) {
  try {
    const { taskId, studentId, message } = await req.json();

    if (!taskId || !studentId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    // 1. Verificar que la tarea exista
    const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });

    if (!task) {
      return NextResponse.json(
        { error: "La tarea no existe." },
        { status: 404 }
      );
    }

    // 2. Evitar postulaciones duplicadas
    const alreadyApplied = await prisma.application.findFirst({
      where: {
        taskId: Number(taskId),
        studentId: Number(studentId),
      },
    });

    if (alreadyApplied) {
      return NextResponse.json(
        { error: "Ya te has postulado a esta tarea." },
        { status: 400 }
      );
    }

    // 3. Crear postulación
    const application = await prisma.application.create({
      data: {
        taskId: Number(taskId),
        studentId: Number(studentId),
        message: message || "",
        status: "PENDIENTE",
      },
    });

    return NextResponse.json(application);
  } catch (err: any) {
    console.error("APPLICATION ERROR:", err);
    return NextResponse.json({ error: "Error en el servidor." }, { status: 500 });
  }
}

// ==============================================
// GET → Ver aplicaciones (opcional)
// Ejemplo: /api/applications?studentId=3
// ==============================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId requerido" },
        { status: 400 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { studentId: Number(studentId) },
      include: {
        task: true, // Trae info de la tarea
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
