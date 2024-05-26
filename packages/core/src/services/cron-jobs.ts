import T from "../translations/index.js";
import cron from "node-cron";
import { LucidError } from "../utils/error-handler.js";
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
		throw new LucidError({
			message: T("an_error_occurred_clearing_expired_tokens"),
		});
	}
};

const updateMediaStorage = async (serviceConfig: ServiceConfig) => {
	try {
		const MediaRepo = Repository.get("media", serviceConfig.db);
		const ProcessedImagesRepo = Repository.get(
			"processed-images",
			serviceConfig.db,
		);
		const OptionsRepo = Repository.get("options", serviceConfig.db);

		const [mediaItems, processeddImagesItems] = await Promise.all([
			MediaRepo.selectMultiple({
				select: ["file_size"],
				where: [],
			}),
			ProcessedImagesRepo.selectMultiple({
				select: ["file_size"],
				where: [],
			}),
		]);

		const totlaMediaSize = mediaItems.reduce((acc, item) => {
			return acc + item.file_size;
		}, 0);
		const totalProcessedImagesSize = processeddImagesItems.reduce(
			(acc, item) => {
				return acc + item.file_size;
			},
			0,
		);

		await OptionsRepo.updateSingle({
			where: [
				{
					key: "name",
					operator: "=",
					value: "media_storage_used",
				},
			],
			data: {
				valueInt: totlaMediaSize + totalProcessedImagesSize,
			},
		});
	} catch (error) {
		throw new LucidError({
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
