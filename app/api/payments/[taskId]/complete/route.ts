import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params; // 👈 NECESARIO PARA VERCEL + NEXT 16

  const id = Number(taskId);

  const body = await req.json();
  const { method } = body;

  if (!method) {
    return NextResponse.json(
      { error: "Método de pago requerido" },
      { status: 400 }
    );
  }

  const payment = await prisma.payment.findUnique({ where: { taskId: id } });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Actualizamos payment
  await prisma.payment.update({
    where: { taskId: id },
    data: {
      status: "PAGADO",
      method,
    },
  });

  // Cambiar estado de tarea
  await prisma.task.update({
    where: { id },
    data: { status: "COMPLETADA" },
  });

  return NextResponse.json({ message: "Pago completado exitosamente" });
}
