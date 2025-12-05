import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/student/negotiations?studentId=123
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = Number(searchParams.get("studentId"));

  if (!studentId || Number.isNaN(studentId)) {
    return NextResponse.json(
      { error: "studentId requerido" },
      { status: 400 }
    );
  }

  // Buscar negociaciones del estudiante
  const negotiations = await prisma.payment.findMany({
    where: {
      studentId,
      priceStatus: {
        in: ["PROPUESTO", "ACEPTADO", "RECHAZADO"], // ⭐ negociaciones activas
      },
    },
    include: {
      task: {
        include: {
          client: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ negotiations });
}
