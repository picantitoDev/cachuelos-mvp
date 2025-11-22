import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        status: "PUBLICADA",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error loading public tasks:", error);
    return NextResponse.json(
      { error: "Error loading tasks" },
      { status: 500 }
    );
  }
}