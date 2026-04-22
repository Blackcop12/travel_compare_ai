import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        blue: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        slate: colors.zinc,
        ink: "#0b0b0f",
        ember: "#10b981",
        mist: "#0f0f13",
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        sans: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 45px -20px rgba(16, 185, 129, 0.45)",
      },
    },
  },
  plugins: [],
};
