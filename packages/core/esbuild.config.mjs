import * as esbuild from "esbuild";
import { yellow } from "console-log-colors";

const outDir = "./dist";

const now = new Date();

await esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outdir: outDir,
  minify: true,
  sourcemap: true,
  loader: {
    ".ts": "ts",
  },
  platform: "node",
});

const time = new Date() - now;

console.log(yellow("------------------------------------------"));
console.log(yellow(`Assets built successfully! Completed in ${time}ms!`));
console.log(yellow("------------------------------------------"));
