import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // 1. Buscar TODOS los mensajes en los que participa
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const convMap = new Map();

    // 2. Agrupar por conversación (otherUser + taskId)
    for (const msg of messages) {
      const otherUser =
        msg.senderId === userId ? msg.receiver : msg.sender;

      const key = `${otherUser.id}-${msg.taskId}`;

      if (!convMap.has(key)) {
        convMap.set(key, {
          id: key,
          otherUserId: otherUser.id,
          otherUserName: otherUser.name,
          taskId: msg.task.id,
          taskTitle: msg.task.title,
          taskStatus: msg.task.status,
          lastMessage: msg.content,
          createdAt: msg.createdAt,
        });
      }
    }

    // 3. Ordenar por el más reciente
    const conversations = Array.from(convMap.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return NextResponse.json(conversations);

  } catch (error) {
    console.error("CONVERSATIONS API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
