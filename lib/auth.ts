import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "habit_session";

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("Missing JWT_SECRET environment variable");
  return new TextEncoder().encode(jwtSecret);
}

export type Session = { userId: string; email: string; name: string };

export async function createToken(session: Session) {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(getJwtSecret());
}
export async function getSession(): Promise<Session | null> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (typeof payload.userId !== "string" || typeof payload.email !== "string" || typeof payload.name !== "string") return null;
    return { userId: payload.userId, email: payload.email, name: payload.name };
  } catch { return null; }
}
export function sessionCookie(token: string) {
  return { name: COOKIE_NAME, value: token, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 };
}
export function clearSessionCookie() { return { name: COOKIE_NAME, value: "", httpOnly: true, path: "/", maxAge: 0 }; }
