import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";
export async function POST() { const response = NextResponse.json({ ok: true }); response.headers.set("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`); return response; }
