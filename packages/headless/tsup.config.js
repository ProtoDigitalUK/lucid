import fs from "fs-extra";
import { join } from "path";
import { defineConfig } from "tsup";

const directoriesToCopy = [
	{
		dir: "src/assets",
		dest: "assets",
	},
];

export default defineConfig({
	entry: ["src/index.ts"],
	dts: true,
	format: "esm",
	shims: true,
	sourcemap: true,
	clean: true,
	metafile: true,
	async onSuccess() {
		for (const item of directoriesToCopy) {
			const source = join(process.cwd(), item.dir);
			const dest = join(process.cwd(), "dist", item.dest);
			fs.copySync(source, dest);
		}
		setTimeout(() => {
			fs.ensureFileSync(join(process.cwd(), "restart.txt"));
			fs.writeFileSync(
				join(process.cwd(), "restart.txt"),
				new Date().toISOString(),
			);
		}, 300);
	},
});
