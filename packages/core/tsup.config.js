import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/exports/types.ts",
    "src/exports/adapters.ts",
    "src/exports/builders.ts",
    "src/exports/api.ts",
    "src/exports/middleware.ts",
  ],
  dts: true,
  format: "esm",
  shims: false,
  sourcemap: true,
  clean: true,
  metafile: true,
});
