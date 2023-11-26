/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // -------------------------------------
        // Accents

        // black
        primary: "#16161A",
        primaryH: "#2E2E34",
        primaryText: "#FFFFFF",
        primaryA: "#414141",
        primaryA2: "#343439",
        // purple
        secondary: "#6554FB",
        secondaryH: "#594AE1",
        secondaryText: "#FFFFFF",

        backgroundAccent: "#E4E9EC",
        backgroundAccentH: "#DDE2E5",

        container: "#FFFFFF",

        border: "#D7DDE4",

        error: "#FC3636",
        errorH: "#D92C2C",
        errorText: "#FFFFFF",
        success: "#32AD84",
        warning: "#FFC107",

        // -------------------------------------
        // Backgrounds
        background: "#F8F9FA",

        // -------------------------------------
        // Typography
        title: "#16161A",
        body: "#474D51",
        unfocused: "#737B80",
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
  plugins: [require("@tailwindcss/typography")],
};
