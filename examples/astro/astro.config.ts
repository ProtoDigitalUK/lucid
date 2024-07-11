import { defineConfig } from "astro/config";
// import fastify from "@matthewp/astro-fastify";
import lucid from "@lucidcms/astro-adapter";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: lucid(),
});
