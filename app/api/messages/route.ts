import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req) {
  try {
    const { senderId, receiverId, taskId, content } = await req.json();

    if (!senderId || !receiverId || !taskId || !content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        taskId,
        content,
      },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error("MESSAGE POST ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
