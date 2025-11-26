import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request, context: any) {
  // 👇 AQUÍ ESTÁ LA CORRECCIÓN IMPORTANTE
  const { id } = await context.params;
  const appId = Number(id);

  const app = await prisma.application.findUnique({
    where: { id: appId },
    include: { task: true },
  });

  if (!app) {
    return NextResponse.json(
      { error: "Aplicación no encontrada" },
      { status: 404 }
    );
  }

  const taskId = app.taskId;
  const studentId = app.studentId;

  // 1) Aceptar esta aplicación
  await prisma.application.update({
    where: { id: appId },
    data: { status: "ACEPTADA" },
  });

  // 2) Rechazar todas las demás
  await prisma.application.updateMany({
    where: {
      taskId,
      id: { not: appId },
    },
    data: { status: "RECHAZADA" },
  });

  // 3) Actualizar la tarea
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      assignedId: studentId,
      status: "EN_NEGOCIACION",
    },
  });

  return NextResponse.json(updatedTask);
}
