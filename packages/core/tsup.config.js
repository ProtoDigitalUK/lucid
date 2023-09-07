import fs from "fs-extra";
import { join } from "path";
import { defineConfig } from "tsup";

const directoriesToCopy = [
  {
    dir: "src/assets",
    dest: "assets",
  },
  {
    dir: "src/db/migrations",
    dest: "migrations",
  },
];

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  shims: true,
  sourcemap: true,
  clean: true,
  metafile: true,
  async onSuccess() {
    directoriesToCopy.forEach((item) => {
      const source = join(process.cwd(), item.dir);
      const dest = join(process.cwd(), "dist", item.dest);
      fs.copySync(source, dest);
    });
  },
});
