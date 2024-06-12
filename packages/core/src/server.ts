import Fastify from "fastify";
import lucidPlugin from "./lucid-plugin.js";
import serverStartLog from "./libs/logging/server-start-log.js";

const startTime = process.hrtime();
const fastify = Fastify();

fastify.register(lucidPlugin);

const start = async () => {
	fastify.listen(
		{
			port: Number(process.env.PORT) || 8393,
			host: process.env.HOST || "localhost",
		},
		(err, address) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}

			serverStartLog(address, startTime);
		},
	);
};

export { start, fastify };
