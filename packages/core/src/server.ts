import Fastify from "fastify";
import headlessPlugin from "./headless-plugin.js";
import serverStartLog from "./libs/logging/server-start-log.js";

const startTime = process.hrtime();
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

			serverStartLog(address, startTime);
		},
	);
};

export { start, fastify };
