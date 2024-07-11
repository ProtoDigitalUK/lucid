import fastify from "@matthewp/astro-fastify";

export default () =>
	fastify({
		entry: new URL("./register.js", import.meta.url),
	});
