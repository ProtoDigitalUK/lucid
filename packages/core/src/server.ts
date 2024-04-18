import Fastify from "fastify";
import headlessPlugin from "./headless-plugin.js";
import headlessLogger from "./libs/logging/index.js";

const fastify = Fastify();

fastify.register(headlessPlugin);

const start = async () => {
	fastify.listen(
		{
			port: Number(process.env.PORT) || 8393,
			host: "0.0.0.0",
		},
		(err, address) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}

			headlessLogger("info", {
				message: `API started at: ${address}`,
			});
		},
	);
};

export { start, fastify };
