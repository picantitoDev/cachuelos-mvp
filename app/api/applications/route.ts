import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // tu path correcto

// Crear postulación
export async function POST(req: Request) {
  try {
    const { studentId, taskId, message } = await req.json();

    if (!studentId || !taskId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si ya postuló antes
    const exists = await prisma.application.findFirst({
      where: { studentId, taskId },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Ya has postulado a esta tarea" },
        { status: 409 }
      );
    }

    // Crear la postulación
    const application = await prisma.application.create({
      data: {
        studentId,
        taskId,
        message: message || null,
      },
    });

    return NextResponse.json(application);

  } catch (error) {
    console.error("Error en POST /api/applications", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}


// Obtener postulaciones de un estudiante
export async function GET(req: Request) {
  const url = new URL(req.url);
  const studentId = url.searchParams.get("studentId");

  if (!studentId)
    return NextResponse.json(
      { error: "studentId requerido" },
      { status: 400 }
    );

  const apps = await prisma.application.findMany({
    where: { studentId: Number(studentId) },
    include: {
      task: true,
    },
  });

  return NextResponse.json(apps);
}
