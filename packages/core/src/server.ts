import Fastify from "fastify";
import lucidPlugin from "./lucid-plugin.js";
import serverStartLog from "./utils/logging/server-start-log.js";

const startTime = process.hrtime();
const fastify = Fastify();

fastify.register(lucidPlugin);

const start = async () => {
	fastify.listen(
		{
			port: Number(process.env.PORT) || 8393,
			host: process.env.HOST || "localhost",
		},
		(err, address) => serverStartLog(address, startTime),
	);
};

export { start, fastify };
