import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function localDate(value = new Date()) { return value.toLocaleDateString("en-CA"); }
export function dateFromKey(key: string) { return new Date(`${key}T12:00:00`); }
// Local calendar dates avoid UTC rollover around midnight for daily habit records.
export function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
