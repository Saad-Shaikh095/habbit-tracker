import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api";
import { dateKey } from "@/lib/utils";

export async function GET() {
  const { session, response } = await requireSession(); if (response) return response;
  const habits = await prisma.habit.findMany({ where: { userId: session!.userId }, include: { completions: { where: { completed: true }, select: { date: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ habits: habits.map(h => ({ id: h.id, title: h.title, createdAt: h.createdAt, completedDates: h.completions.map(c => dateKey(c.date)) })) });
}
const schema = z.object({ title: z.string().trim().min(1).max(100) });
export async function POST(request: NextRequest) {
  const { session, response } = await requireSession(); if (response) return response;
  try { const { title } = schema.parse(await request.json()); const habit = await prisma.habit.create({ data: { userId: session!.userId, title } }); return NextResponse.json({ habit: { ...habit, completedDates: [] } }, { status: 201 }); }
  catch { return NextResponse.json({ error: "Habit title must be between 1 and 100 characters." }, { status: 400 }); }
}
