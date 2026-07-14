import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // --- Language Passport palette (named tokens for new/motif components) ---
        "ink-navy": { DEFAULT: "#1B2A4C", dark: "#101B33" },
        postcard: { DEFAULT: "#F5EFE0", dark: "#EAE1CB" },
        airmail: { DEFAULT: "#E8543F", dark: "#C43F2D" },
        "stamp-teal": "#2A9D8F",
        "gold-foil": "#D4A657",
        "paper-line": "#D9CDB0",
        "ink-muted": "#5C6478",

        // --- Retint the existing design-system tokens so every screen picks
        // up the passport palette automatically, without touching each file ---
        slate: {
          50: "#F5EFE0", // postcard-cream
          100: "#EAE1CB", // postcard-cream-dark
          200: "#D9CDB0", // paper-line
          300: "#C6B896",
          400: "#9C927A",
          500: "#5C6478", // ink-muted
          600: "#4A5164",
          700: "#38405A",
          800: "#232F4D",
          900: "#1B2A4C", // ink-navy
        },
        primary: {
          50: "#FDECE9",
          100: "#FBD4CC",
          200: "#F5AC9C",
          300: "#EF8168",
          400: "#EB6A4E",
          500: "#E8543F", // airmail-red
          600: "#D4482F",
          700: "#C43F2D",
          800: "#9E3223",
          900: "#7A271B",
        },
        brand: {
          DEFAULT: "#E8543F", // airmail-red
          light: "#EF8168",
          dark: "#C43F2D",
        },
        success: "#2A9D8F", // stamp-teal
        warning: "#D4A657", // gold-foil
        error: "#C43F2D",
        surface: {
          DEFAULT: "#F5EFE0", // postcard-cream
          muted: "#EAE1CB", // postcard-cream-dark
          border: "#D9CDB0", // paper-line
        },
        // Per-language accent, used consistently for EN/ZH/JA across the app
        lang: {
          en: "#2A9D8F", // stamp-teal
          zh: "#E8543F", // airmail-red
          ja: "#D4A657", // gold-foil
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        // Passport corners are close to square — squash the defaults so every
        // existing rounded-lg/xl/2xl usage reads as "passport", not "SaaS app"
        DEFAULT: "6px",
        md: "5px",
        lg: "6px",
        xl: "6px",
        "2xl": "8px",
      },
      boxShadow: {
        // Hard offset "stamp" shadow replaces the soft blurred card shadows
        card: "3px 3px 0px 0px #1B2A4C",
        "card-hover": "4px 4px 0px 0px #1B2A4C",
        stamp: "3px 3px 0px 0px #1B2A4C",
        "stamp-sm": "2px 2px 0px 0px #1B2A4C",
        "stamp-gold": "3px 3px 0px 0px #D4A657",
      },
      backgroundImage: {
        airmail: `repeating-linear-gradient(45deg, #E8543F 0px, #E8543F 10px, transparent 10px, transparent 20px, #1B2A4C 20px, #1B2A4C 30px, transparent 30px, transparent 40px)`,
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        flip: "flip 0.6s ease-in-out",
        stamp: "stampDrop 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        stampDrop: {
          "0%": { transform: "scale(1.4) rotate(-12deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(-6deg)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
