import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  _req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await context.params;
  const id = Number(taskId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // Actualizamos el pago
    const updatedPayment = await prisma.payment.update({
      where: { taskId: id },
      data: {
        status: "PAGADO",  // 👈 nuevo estado
      },
    });

    // Actualizamos la tarea
    await prisma.task.update({
      where: { id },
      data: {
        status: "EN_PROGRESO", // 👈 después del pago la tarea inicia
      },
    });

    return NextResponse.json({
      message: "Pago realizado exitosamente",
      payment: updatedPayment,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error procesando pago" },
      { status: 500 }
    );
  }
}
