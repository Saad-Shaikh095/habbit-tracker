import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, createToken, sessionCookieOptions } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(100)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = schema.parse({
      name: body?.name,
      email: body?.email,
      password: body?.password
    });

    const email = input.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const user = await prisma.user.create({ data: { name: input.name, email, passwordHash: await bcrypt.hash(input.password, 12) } });
    const response = NextResponse.json({ user: { name: user.name, email: user.email } }, { status: 201 });
    const token = await createToken({ userId: user.id, name: user.name, email: user.email });
    response.headers.set("Set-Cookie", `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    return response;
  } catch (error) {
    console.error("signup error", error instanceof Error ? error.stack : error);
    const message = error instanceof z.ZodError ? "Please provide a valid name, email, and password (8+ characters)." : "Unable to create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
