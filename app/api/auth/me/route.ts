import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api";
export async function GET() { const { session, response } = await requireSession(); return response ?? NextResponse.json({ user: { name: session!.name, email: session!.email } }); }
