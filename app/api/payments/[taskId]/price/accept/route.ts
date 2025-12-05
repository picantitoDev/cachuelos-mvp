import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params;
  const id = Number(taskId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // Obtener pago
  const payment = await prisma.payment.findUnique({
    where: { taskId: id },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  if (payment.priceStatus !== "PROPUESTO") {
    return NextResponse.json(
      { error: "No hay propuesta para aceptar" },
      { status: 400 }
    );
  }

  const newPrice = payment.proposedPrice!;
  const commission = newPrice * 0.2;
  const total = newPrice + commission;

  // Actualizar pago
  const updatedPayment = await prisma.payment.update({
    where: { taskId: id },
    data: {
      priceFinal: newPrice,
      commission: commission,
      totalAmount: total,
      priceStatus: "ACEPTADO",
    },
  });

  // Cambiar tarea a EN_PROGRESO
  await prisma.task.update({
    where: { id },
    data: { status: "EN_PROGRESO" },
  });

  return NextResponse.json({
    message: "Precio aceptado",
    payment: updatedPayment,
  });
}
