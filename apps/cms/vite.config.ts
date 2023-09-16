import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

import eslint from "vite-plugin-eslint";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    eslint({ cache: false, include: ["./src/**/*.ts", "./src/**/*.tsx"] }),
    solidPlugin(),
    mkcert(),
  ],
  server: {
    port: 3000,
    https: true,
  },
  build: {
    target: "esnext",
    outDir: "../../packages/core/cms",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@lucid-core": fileURLToPath(
        new URL("../../packages/core/src", import.meta.url)
      ),
    },
  },
});
