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

  const payment = await prisma.payment.findUnique({
    where: { taskId: id },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  if (payment.priceStatus !== "PROPUESTO") {
    return NextResponse.json(
      { error: "No hay propuesta para rechazar" },
      { status: 400 }
    );
  }

  const updatedPayment = await prisma.payment.update({
    where: { taskId: id },
    data: {
      priceStatus: "RECHAZADO",
    },
  });

  return NextResponse.json({
    message: "Propuesta rechazada",
    payment: updatedPayment,
  });
}
