import type { FastifyInstance } from "fastify";
import T from "../translations/index.js";
import cron from "node-cron";
import { InternalError } from "../utils/error-handler.js";

const clearExpiredTokens = async (fastify: FastifyInstance) => {
	try {
		await fastify.db
			.deleteFrom("headless_user_tokens")
			.where("expiry_date", "<", new Date())
			.execute();
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
