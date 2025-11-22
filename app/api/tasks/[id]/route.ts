import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("GET TASK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
