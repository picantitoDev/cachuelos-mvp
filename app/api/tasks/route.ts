import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// 📌 Crear tarea
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, description, category, location, budget, clientId } = body;

    if (!title || !description || !category || !location || !budget || !clientId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        budget,
        category,
        location,
        clientId,
        status: "PUBLICADA",
      },
    });

    return NextResponse.json(task);
  } catch (err: any) {
    console.error("TASK CREATE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📌 Obtener tareas del cliente
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = Number(searchParams.get("clientId"));

    const tasks = await prisma.task.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
