"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const value = localStorage.getItem("theme") === "dark"; setDark(value); document.documentElement.classList.toggle("dark", value); }, []);
  function toggle() { const value = !dark; setDark(value); localStorage.setItem("theme", value ? "dark" : "light"); document.documentElement.classList.toggle("dark", value); }
  return <button onClick={toggle} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Toggle theme">{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>;
}
