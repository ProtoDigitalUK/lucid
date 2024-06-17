import cron from "node-cron";
import LucidServices from "../index.js";
import constants from "../../constants/constants.js";
import type { ServiceFn } from "../../libs/services/types.js";

const registerCronJobs: ServiceFn<[], undefined> = async (service) => {
	cron.schedule(constants.cronSchedule, async () => {
		// LucidServices.crons.clearExpiredLocales(service);
		LucidServices.crons.clearExpiredTokens(service);
		LucidServices.crons.updateMediaStorage(service);
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default registerCronJobs;
