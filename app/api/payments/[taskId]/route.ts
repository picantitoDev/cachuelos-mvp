import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// ===================================
// GET: obtener información del pago
// ===================================
export async function GET(_req: Request, context: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await context.params;
  const id = Number(taskId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { taskId: id },
    include: {
      client: true,
      student: true,
      task: {
        include: {
          assignedTo: true, // 👈 IMPORTANTE
        },
      },
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  return NextResponse.json(payment);
}


// ===================================
// PATCH: Enviar propuesta de precio (CLIENTE)
// ===================================
export async function PATCH(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params;
  const id = Number(taskId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const newPrice = Number(body.proposedPrice);

  if (!newPrice || newPrice <= 0) {
    return NextResponse.json(
      { error: "Precio inválido" },
      { status: 400 }
    );
  }

  // Actualizar el pago con la nueva propuesta
  const updated = await prisma.payment.update({
    where: { taskId: id },
    data: {
      proposedPrice: newPrice,
      priceStatus: "PROPUESTO",
    },
  });

  return NextResponse.json({
    message: "Propuesta enviada correctamente",
    payment: updated,
  });
}
