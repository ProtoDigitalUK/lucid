import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default defineConfig({
	plugins: [
		devtools({
			autoname: true,
		}),
		solidPlugin(),
	],
	base: "/admin",
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
		outDir: "../../packages/core/cms",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
