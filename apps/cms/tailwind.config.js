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
        // purple
        secondary: "#6554FB",
        secondaryH: "#594AE1",

        backgroundAccent: "#E4E9EC",
        backgroundAccentH: "#DDE2E5",

        border: "#D7DDE4",

        error: "#FC3636",

        // -------------------------------------
        // Backgrounds
        background: "#F8F9FA",

        // -------------------------------------
        // Typography
        title: "#16161A",
        body: "#474D51",
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      screens: {
        "3xl": "1600px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
