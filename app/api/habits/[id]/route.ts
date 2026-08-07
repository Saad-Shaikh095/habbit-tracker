import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSession(); if (response) return response;
  const { id } = await params;
  const result = await prisma.habit.deleteMany({ where: { id, userId: session!.userId } });
  if (!result.count) return NextResponse.json({ error: "Habit not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
