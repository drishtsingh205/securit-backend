import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
        },
        accent: {
          DEFAULT: "#38BDF8",
          hover: "#7DD3FC",
          muted: "#0EA5E9",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#D97706",
        },
        critical: {
          DEFAULT: "#EF4444",
          light: "#FCA5A5",
          dark: "#DC2626",
        },
        success: {
          DEFAULT: "#22C55E",
          light: "#86EFAC",
          dark: "#16A34A",
        },
        text: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(to right, rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(56, 189, 248, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)" },
        },
      },
      boxShadow: {
        glow: "0 0 15px rgba(56, 189, 248, 0.15)",
        "glow-lg": "0 0 30px rgba(56, 189, 248, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
