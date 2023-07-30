/** @type {import('tailwindcss').Config} */

module.exports = {
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
        // purple
        secondary: "#6554FB",
        secondaryH: "#594AE1",
        secondaryText: "#FFFFFF",

        backgroundAccent: "#E4E9EC",
        backgroundAccentH: "#DDE2E5",

        container: "#FFFFFF",

        border: "#D7DDE4",

        error: "#FC3636",
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
        "animate-enter": "animation-enter 0.2s ease-out",
        "animate-leave": "animation-leave 0.2s ease-out",
        "animate-dropdown": "animation-dropdown 0.2s ease-out",
        "animate-from-left": "animation-from-left 0.2s ease-out",
      },
      spacing: {
        30: "30px",
        15: "15px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
