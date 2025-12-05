import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = Number(params.taskId);

  const body = await req.json();
  const { method } = body; // TARJETA / YAPE / PLIN / TRANSFERENCIA

  if (!method) {
    return NextResponse.json(
      { error: "Método de pago requerido" },
      { status: 400 }
    );
  }

  const payment = await prisma.payment.findUnique({ where: { taskId } });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Actualizamos payment
  await prisma.payment.update({
    where: { taskId },
    data: {
      status: "PAGADO",
      method,
    },
  });

  // Cambiar estado de la tarea
  await prisma.task.update({
    where: { id: taskId },
    data: { status: "COMPLETADA" },
  });

  return NextResponse.json({ message: "Pago completado exitosamente" });
}
