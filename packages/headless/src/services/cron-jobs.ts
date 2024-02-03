import { type FastifyInstance } from "fastify";
import T from "../translations/index.js";
import cron from "node-cron";
import { gt } from "drizzle-orm";
import { userTokens } from "../db/schema.js";
import { InternalError } from "../utils/app/error-handler.js";

const clearExpiredTokens = async (fastify: FastifyInstance) => {
	try {
		await fastify.db
			.delete(userTokens)
			.where(gt(userTokens.expires_at, "NOW()"));
	} catch (error) {
		throw new InternalError(T("an_error_occurred_clearing_expired_tokens"));
	}
};

const registerCronJobs = (fastify: FastifyInstance) => {
	cron.schedule("0 0 * * *", async () => {
		await clearExpiredTokens(fastify);
	});
};

export default registerCronJobs;
