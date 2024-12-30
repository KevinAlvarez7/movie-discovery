/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      }, 
      fontFamily: {
        // Use the CSS variables we defined
        sans: ['var(--font-outfit)'],
        handwritten: ['var(--font-handwritten)'],
      },    
    },
  },
  plugins: [],
} satisfies Config;
