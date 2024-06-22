import T from "../translations/index.js";
import cron from "node-cron";
import constants from "../constants/constants.js";
import lucidLogger from "../utils/logging/index.js";
import serviceWrapper from "../utils/services/service-wrapper.js";
import type { ServiceContext } from "../utils/services/types.js";

const registerCronJobs = async (service: ServiceContext) => {
	try {
		cron.schedule(constants.cronSchedule, async () => {
			lucidLogger("info", {
				message: T("running_cron_jobs"),
			});

			serviceWrapper(service.services.crons.clearExpiredLocales, {
				transaction: true,
				logError: true,
				defaultError: {
					type: "cron",
					name: T("cron_job_error_name"),
					message: T("an_error_occurred_clearing_expired_locales"),
				},
			})(service);
			serviceWrapper(service.services.crons.clearExpiredTokens, {
				transaction: true,
				logError: true,
				defaultError: {
					type: "cron",
					name: T("cron_job_error_name"),
					message: T("an_error_occurred_clearing_expired_tokens"),
				},
			})(service);
			serviceWrapper(service.services.crons.updateMediaStorage, {
				transaction: true,
				logError: true,
				defaultError: {
					type: "cron",
					name: T("cron_job_error_name"),
					message: T("an_error_occurred_updating_media_storage"),
				},
			})(service);
		});
	} catch (error) {
		lucidLogger("error", {
			message: T("cron_job_error_message"),
		});
	}
};

export default registerCronJobs;
