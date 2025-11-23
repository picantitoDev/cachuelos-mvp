import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing user id" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("USER API ERROR:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}