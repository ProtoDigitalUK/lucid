/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          base: "#C5F74E",
          hover: "#B6E644",
          contrast: "#000000",
        },
        container: {
          1: "#070707", // navbar / header
          2: "#1A1A1A", // banner / primary container
          3: "#131313", // background
          4: "#313131", // inputs / secondary container
        },
        icon: {
          base: "#E3E3E3",
          hover: "#E8E8E8",
        },
        error: {
          base: "#F75555",
          hover: "#F63737",
          contrast: "#242424",
        },
        warning: {
          base: "#FFC107",
          contrast: "#000000",
        },
        border: "#414141",
        // Typography
        title: "#F1F1F1",
        body: "#C7C7C7",
        unfocused: "#A0A0A0",
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      screens: {
        "3xl": "1600px",
      },
      gridTemplateColumns: {
        "main-layout": "auto 1fr",
      },
      animation: {
        "animate-enter": "animation-enter 0.2s ease",
        "animate-leave": "animation-leave 0.2s ease",
        "animate-dropdown": "animation-dropdown 0.2s ease",
        "animate-from-left": "animation-from-left 0.2s ease",

        "animate-fade-out": "animation-fade-out 0.2s ease",
        "animate-fade-in": "animation-fade-in 0.2s ease",

        "animate-slide-from-right-in": "animate-slide-from-right-in 200ms ease",
        "animate-slide-from-right-out":
          "animate-slide-from-right-out 200ms ease 100ms forwards",
      },
      spacing: {
        30: "30px",
        15: "15px",
      },
    },
  },
  safelist: ["ql-toolbar", "ql-container"],
  plugins: [typography],
};
