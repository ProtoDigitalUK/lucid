import T from "../translations/index.js";
import cron from "node-cron";
import { HeadlessError } from "../utils/error-handler.js";
import Repository from "../libs/repositories/index.js";
import type { ServiceConfig } from "../utils/service-wrapper.js";

const clearExpiredTokens = async (serviceConfig: ServiceConfig) => {
	try {
		const UserTokensRepo = Repository.get("user-tokens", serviceConfig.db);

		await UserTokensRepo.deleteMultiple({
			where: [
				{
					key: "expiry_date",
					operator: "<",
					value: new Date().toISOString(),
				},
			],
		});
	} catch (error) {
		throw new HeadlessError({
			message: T("an_error_occurred_clearing_expired_tokens"),
		});
	}
};

const updateMediaStorage = async (serviceConfig: ServiceConfig) => {
	try {
		const MediaRepo = Repository.get("media", serviceConfig.db);
		const OptionsRepo = Repository.get("options", serviceConfig.db);

		const mediaItems = await MediaRepo.selectMultiple({
			select: ["file_size"],
			where: [],
		});

		await OptionsRepo.updateSingle({
			where: [
				{
					key: "name",
					operator: "=",
					value: "media_storage_used",
				},
			],
			data: {
				valueInt: mediaItems.reduce((acc, item) => {
					return acc + item.file_size;
				}, 0),
			},
		});
	} catch (error) {
		throw new HeadlessError({
			message: T("an_error_occurred_updating_media_storage"),
		});
	}
};

const registerCronJobs = async (serviceConfig: ServiceConfig) => {
	cron.schedule("0 0 * * *", async () => {
		clearExpiredTokens(serviceConfig);
		updateMediaStorage(serviceConfig);
	});
};

export default registerCronJobs;
