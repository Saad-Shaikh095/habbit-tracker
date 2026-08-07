import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { brand: { 500: "#5b5bd6", 600: "#4a4abc" } } } },
  plugins: []
};

export default config;
