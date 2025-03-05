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
        neutral: {
          30: "#8D8D8D",
          40:"#BBBBBB",
          100: "#FCFCFC",
          0: "#000000",
          60: "#D9D9D9",
          80: "#E8E8E8",
        },
        primary: {
          0:"#004644",
          10: "#007A77",
          80: "#B6F8F4",
          30: "#21F1EC",
          90: "#D2FBF9",
          DEFAULT: "#21F1EC",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
