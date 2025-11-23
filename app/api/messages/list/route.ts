import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const user1 = Number(searchParams.get("user1"));
    const user2 = Number(searchParams.get("user2"));
    const taskId = Number(searchParams.get("taskId"));

    if (!user1 || !user2 || !taskId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        taskId,
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("MESSAGE LIST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
