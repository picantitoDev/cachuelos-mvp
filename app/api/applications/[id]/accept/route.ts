import { NextResponse } from "next/server";
import prisma from "@/lib/db";

const COMMISSION_RATE = 0.2;

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const appId = Number(id);

  if (Number.isNaN(appId)) {
    return NextResponse.json(
      { error: "ID de aplicación inválido" },
      { status: 400 }
    );
  }

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
  const clientId = app.task.clientId;
  const budget = app.task.budget;

  await prisma.application.update({
    where: { id: appId },
    data: { status: "ACEPTADA" },
  });

  await prisma.application.updateMany({
    where: { taskId, id: { not: appId } },
    data: { status: "RECHAZADA" },
  });

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      assignedId: studentId,
      status: "EN_NEGOCIACION",
    },
  });

  let payment = await prisma.payment.findUnique({
    where: { taskId },
  });

  if (!payment) {
    const priceFinal = budget;
    const commission = priceFinal * COMMISSION_RATE;
    const totalAmount = priceFinal + commission;

    payment = await prisma.payment.create({
      data: {
        method: null,
        status: "PENDIENTE",
        priceFinal,
        commission,
        totalAmount,
        taskId,
        clientId,
        studentId,
      },
    });
  }

  return NextResponse.json({ task: updatedTask, payment });
}
