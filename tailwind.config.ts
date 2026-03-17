import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        "primary-hover": "#4338ca",
        border: "#e5e7eb",
        background: "#ffffff",
        "secondary-bg": "#f7f7f8",
        foreground: "#111827",
        "muted-fg": "#6b7280",
        slate: {
          950: "var(--slate-950, #020617)",
          900: "var(--slate-900, #0f172a)",
          800: "var(--slate-800, #1e293b)",
          700: "var(--slate-700, #334155)",
          600: "var(--slate-600, #475569)",
          500: "var(--slate-500, #64748b)",
          400: "var(--slate-400, #94a3b8)",
          300: "var(--slate-300, #cbd5e1)",
          200: "var(--slate-200, #e2e8f0)",
          100: "var(--slate-100, #f1f5f9)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
        card: "0 2px 8px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
        glow: "0 0 16px 0 var(--glow-color, transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
