import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, sessionCookie } from "@/lib/auth";

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(100) });
export async function POST(request: NextRequest) {
  try {
    const { email, password } = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    const response = NextResponse.json({ user: { name: user.name, email: user.email } });
    response.cookies.set(sessionCookie(await createToken({ userId: user.id, name: user.name, email: user.email })));
    return response;
  } catch { return NextResponse.json({ error: "Please provide a valid email and password." }, { status: 400 }); }
}
