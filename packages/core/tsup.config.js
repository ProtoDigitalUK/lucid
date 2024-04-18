import fs from "fs-extra";
import { join } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/types.ts", "src/server.ts"],
	dts: true,
	format: "esm",
	shims: false,
	sourcemap: true,
	clean: true,
	metafile: true,
	async onSuccess() {
		setTimeout(() => {
			fs.ensureFileSync(join(process.cwd(), "restart.txt"));
			fs.writeFileSync(
				join(process.cwd(), "restart.txt"),
				new Date().toISOString(),
			);
		}, 300);
	},
});
