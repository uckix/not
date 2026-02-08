import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        border: "var(--border)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
