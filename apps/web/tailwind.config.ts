import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf6f8",
          100: "#d6edf1",
          200: "#addbe3",
          300: "#85cad5",
          400: "#5cb8c7",
          500: "#3aa4b8",
          600: "#328fa8", // Requested primary color
          700: "#2a7b90", // Darker for text/contrast
          800: "#236676",
          900: "#1c515d"
        }
      },
    }
  },
  plugins: []
} satisfies Config;
