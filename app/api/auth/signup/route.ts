import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, sessionCookie } from "@/lib/auth";

const schema = z.object({ name: z.string().trim().min(2).max(60), email: z.string().trim().email().max(254), password: z.string().min(8).max(100) });
export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const user = await prisma.user.create({ data: { name: input.name, email, passwordHash: await bcrypt.hash(input.password, 12) } });
    const response = NextResponse.json({ user: { name: user.name, email: user.email } }, { status: 201 });
    response.cookies.set(sessionCookie(await createToken({ userId: user.id, name: user.name, email: user.email })));
    return response;
  } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? "Please provide a valid name, email, and password (8+ characters)." : "Unable to create account." }, { status: 400 }); }
}
