import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api";
import { dateFromKey } from "@/lib/utils";

const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), completed: z.boolean() });
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSession(); if (response) return response;
  try {
    const { id } = await params; const { date, completed } = schema.parse(await request.json());
    const habit = await prisma.habit.findFirst({ where: { id, userId: session!.userId }, select: { id: true } });
    if (!habit) return NextResponse.json({ error: "Habit not found." }, { status: 404 });
    const completionDate = dateFromKey(date);
    await prisma.completion.upsert({ where: { habitId_date: { habitId: id, date: completionDate } }, create: { habitId: id, date: completionDate, completed }, update: { completed } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Invalid completion data." }, { status: 400 }); }
}
