import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, createToken, sessionCookieOptions } from "@/lib/auth";

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(100) });
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = schema.parse({ email: body?.email, password: body?.password });
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    const response = NextResponse.json({ user: { name: user.name, email: user.email } });
    const token = await createToken({ userId: user.id, name: user.name, email: user.email });
    response.headers.set("Set-Cookie", `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    return response;
  } catch { return NextResponse.json({ error: "Please provide a valid email and password." }, { status: 400 }); }
}
