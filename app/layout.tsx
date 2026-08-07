import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Habitly | Habit Tracker", description: "Build a better routine, one day at a time." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
