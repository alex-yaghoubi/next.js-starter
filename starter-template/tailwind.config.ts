/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";
import { colors as defaultColors } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        english: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        persian: ["Tahoma", "Arial", "sans-serif"],
      },
      screens: {
        "3xl": "1680px",
      },
      colors: {
        ...defaultColors,
        ...{
          "octa-light": {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#b4bac2",
          },
          // "octa-dark": {
          //   50: "#212121",
          //   100: "#141414",
          //   200: "#0a0a0a",
          //   300: "#000000",
          // },
          "octa-dark": {
            50: "#373A41", // روشن‌ترین
            100: "#22262F",
            200: "#13161B",
            300: "#0C0E12", // تیره‌ترین
          },
          "octa-base": {
            100: "#ffffff",
          },

          "color-1": "hsl(var(--color-1))",
          "color-2": "hsl(var(--color-2))",
          "color-3": "hsl(var(--color-3))",
          "color-4": "hsl(var(--color-4))",
          "color-5": "hsl(var(--color-5))",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "spin-slow": "spin 25s linear infinite",
        "shiny-text": "shiny-text 8s infinite",
        gradient: "gradient 8s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        shine: "shine var(--duration) infinite linear",
        meteor: "meteor 5s linear infinite",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
        rainbow: "rainbow var(--speed, 2s) infinite linear",
      },
      keyframes: {
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-rtl")],
};

export default config;
