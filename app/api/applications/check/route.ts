import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const taskId = Number(searchParams.get("taskId"));
  const studentId = Number(searchParams.get("studentId"));

  const exists = await prisma.application.findFirst({
    where: { taskId, studentId },
  });

  return NextResponse.json({ applied: !!exists });
}
