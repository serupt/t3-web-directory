/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Lora", "serif"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B303A",
          50: "#DBDEE5",
          100: "#D0D4DC",
          200: "#B8BECA",
          300: "#A1A9B9",
          400: "#8993A8",
          500: "#727E96",
          600: "#5F6A80",
          700: "#4E5769",
          800: "#3C4351",
          900: "#2B303A",
        },
        secondary: {
          DEFAULT: "#B392AC",
          50: "#FEFEFE",
          100: "#F6F2F5",
          200: "#E5DAE3",
          300: "#D5C2D1",
          400: "#C4AABE",
          500: "#B392AC",
          600: "#9C7193",
          700: "#7D5775",
          800: "#5C4056",
          900: "#3B2937",
        },
      },
    },
    darkMode: "class",
  },
  plugins: [require("daisyui")],
};
