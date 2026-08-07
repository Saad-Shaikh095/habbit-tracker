"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup"; const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/auth/${signup ? "signup" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json(); setLoading(false);
    if (!response.ok) return setError(result.error || "Something went wrong.");
    window.location.assign("/dashboard");
  }
  return <main className="grid min-h-screen place-items-center p-5"><div className="absolute right-5 top-5"><ThemeToggle/></div><section className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-xl shadow-slate-200/40 dark:bg-slate-900 dark:shadow-none"><div className="mb-8"><p className="mb-2 text-sm font-semibold text-brand-500">HABITLY</p><h1 className="text-3xl font-bold tracking-tight">{signup ? "Start your journey" : "Welcome back"}</h1><p className="mt-2 text-sm text-slate-500">{signup ? "Build the routines that matter to you." : "Sign in to keep your momentum going."}</p></div><form onSubmit={submit} className="space-y-4">{signup && <label className="block text-sm font-medium">Name<input required name="name" minLength={2} maxLength={60} className="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-500" placeholder="Your name"/></label>}<label className="block text-sm font-medium">Email<input required name="email" type="email" className="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@example.com"/></label><label className="block text-sm font-medium">Password<input required name="password" type="password" minLength={signup ? 8 : 1} className="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-500" placeholder={signup ? "At least 8 characters" : "Your password"}/></label>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">{loading ? "Please wait…" : signup ? "Create account" : "Sign in"}</button></form><p className="mt-6 text-center text-sm text-slate-500">{signup ? "Already have an account?" : "New to Habitly?"} <Link className="font-semibold text-brand-500" href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create an account"}</Link></p></section></main>;
}
