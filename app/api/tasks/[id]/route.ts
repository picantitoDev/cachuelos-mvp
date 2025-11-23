import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req, context) {
  try {
    const { id } = await context.params; // <- FIX PARA NEXT 14–16

    const taskId = Number(id);
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "Invalid ID" }, 
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        applications: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);

  } catch (error) {
    console.error("TASK BY ID ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
