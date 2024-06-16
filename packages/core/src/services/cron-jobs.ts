import T from "../translations/index.js";
import cron from "node-cron";
import { LucidError } from "../utils/error-handler.js";
import Repository from "../libs/repositories/index.js";
import type { ServiceConfig, ServiceFn } from "../libs/services/types.js";

const clearExpiredTokens = async (service: ServiceConfig) => {
	try {
		const UserTokensRepo = Repository.get("user-tokens", service.db);

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

const updateMediaStorage = async (service: ServiceConfig) => {
	try {
		const MediaRepo = Repository.get("media", service.db);
		const ProcessedImagesRepo = Repository.get(
			"processed-images",
			service.db,
		);
		const OptionsRepo = Repository.get("options", service.db);

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

const registerCronJobs: ServiceFn<[], undefined> = async (
	service: ServiceConfig,
) => {
	cron.schedule("0 0 * * *", async () => {
		clearExpiredTokens(service);
		updateMediaStorage(service);
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default registerCronJobs;
