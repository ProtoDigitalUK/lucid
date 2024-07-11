import path from "node:path";
import { lucidPlugin, getConfigPath } from "@lucidcms/core";
import type { DefineFastifyRoutes } from "@matthewp/astro-fastify";

const configPath = getConfigPath(process.cwd());
const configModule = await import(path.resolve(configPath));

const defineRoutes: DefineFastifyRoutes = async (fastify) => {
	await fastify.register(
		lucidPlugin({
			config: configModule.default,
		}),
	);
};

export default defineRoutes;
