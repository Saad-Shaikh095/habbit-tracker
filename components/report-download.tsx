"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { dateKey } from "@/lib/utils";

type Habit = { title: string; createdAt: string; completedDates: string[] };
type Props = { name: string; habits: Habit[]; todayRate: number; monthly: number; yearly: number };

function currentStreak(dates: string[]) {
  const completed = new Set(dates); let days = 0; const cursor = new Date();
  while (completed.has(dateKey(cursor))) { days++; cursor.setDate(cursor.getDate() - 1); }
  return days;
}

export function ReportDownload({ name, habits, todayRate, monthly, yearly }: Props) {
  const [exporting, setExporting] = useState(false);
  async function download() {
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF(); const width = pdf.internal.pageSize.getWidth(); let y = 20;
      const summaries = habits.map(habit => {
        const availableDays = Math.max(1, Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / 86_400_000) + 1);
        const completed = habit.completedDates.length;
        return { ...habit, completed, availableDays, rate: Math.min(100, Math.round(completed / availableDays * 100)), streak: currentStreak(habit.completedDates) };
      });
      const completed = summaries.reduce((sum, habit) => sum + habit.completed, 0);
      const possible = summaries.reduce((sum, habit) => sum + habit.availableDays, 0);
      const overall = possible ? Math.round(completed / possible * 100) : 0;
      pdf.setFillColor(91, 91, 214); pdf.rect(0, 0, width, 34, "F"); pdf.setTextColor(255, 255, 255); pdf.setFontSize(20); pdf.text("Habitly Progress Report", 14, 18); pdf.setFontSize(10); pdf.text(`Prepared for ${name || "Habitly member"} - ${new Date().toLocaleDateString()}`, 14, 26);
      pdf.setTextColor(25, 32, 52); y = 47; pdf.setFontSize(14); pdf.text("Overall progress", 14, y); y += 9; pdf.setFontSize(11); pdf.text(`Overall consistency: ${overall}%`, 14, y); y += 7; pdf.text(`Habits tracked: ${habits.length}`, 14, y); y += 7; pdf.text(`Completed check-ins: ${completed}`, 14, y); y += 7; pdf.text(`Today: ${todayRate}% | Last 30 days: ${monthly}% | Last 365 days: ${yearly}%`, 14, y);
      y += 14; pdf.setFontSize(14); pdf.text("Habit breakdown", 14, y); y += 8; pdf.setFillColor(241, 245, 249); pdf.rect(14, y - 5, 182, 8, "F"); pdf.setFontSize(9); pdf.text("Habit", 16, y); pdf.text("Progress", 125, y); pdf.text("Streak", 165, y); y += 7;
      summaries.forEach(habit => { if (y > 275) { pdf.addPage(); y = 20; } pdf.setTextColor(25, 32, 52); const lines = pdf.splitTextToSize(habit.title, 100); pdf.text(lines, 16, y); pdf.text(`${habit.completed}/${habit.availableDays} (${habit.rate}%)`, 125, y); pdf.text(`${habit.streak} days`, 165, y); y += Math.max(7, lines.length * 5 + 2); });
      if (!summaries.length) { pdf.setTextColor(100, 116, 139); pdf.text("No habits have been created yet.", 16, y); }
      pdf.setTextColor(100, 116, 139); pdf.setFontSize(8); pdf.text("Generated locally by Habitly", 14, 290); pdf.save(`habitly-progress-${dateKey(new Date())}.pdf`);
    } finally { setExporting(false); }
  }
  const completed = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  return <section className="mb-7 rounded-2xl border bg-gradient-to-r from-brand-500 to-indigo-500 p-5 text-white sm:flex sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-white/75">Overall progress report</p><h2 className="mt-1 text-2xl font-bold">Your habit history, in one place</h2><p className="mt-1 text-sm text-white/80">{completed} completed check-ins across {habits.length} habits.</p></div><button onClick={download} disabled={exporting} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-slate-100 disabled:opacity-60 sm:mt-0"><Download size={17}/>{exporting ? "Preparing PDF..." : "Download PDF report"}</button></section>;
}
