import starlightPlugin from "@astrojs/starlight-tailwind";

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: {
          base: "#C2F970",
          hover: "#B9EC6C",
          contrast: "#000",
        },
        container: {
          1: "#070707",
        },
        typography: {
          title: {
            light: "#F1F1F1",
            dark: "#000",
          },
          body: {
            light: "#F1F1F1",
            dark: "#000",
          },
        },
      },
      animation: {
        fade: "fadeIn .5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  safelist: ["site-title", "header"],
  plugins: [starlightPlugin()],
};
