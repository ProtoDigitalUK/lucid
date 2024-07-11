import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { lucidPlugin } from "@lucidcms/core";
import type { DefineFastifyRoutes } from "@matthewp/astro-fastify";

const defineRoutes: DefineFastifyRoutes = async (fastify) => {
	register("ts-node/esm", pathToFileURL("./"));
	await fastify.register(lucidPlugin);
};

export default defineRoutes;
