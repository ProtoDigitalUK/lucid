import Repository from "../../libs/repositories/index.js";
import mediaServices from "../media/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	key: string;
}

const clearSingle = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const mediaStategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const allProcessedImages = await ProcessedImagesRepo.selectMultiple({
		select: ["key"],
		where: [
			{
				key: "media_key",
				operator: "=",
				value: data.key,
			},
		],
	});

	if (allProcessedImages.length === 0) return;

	await Promise.all([
		mediaStategy.deleteMultiple(allProcessedImages.map((i) => i.key)),
		ProcessedImagesRepo.deleteMultiple({
			where: [
				{
					key: "media_key",
					operator: "=",
					value: data.key,
				},
			],
		}),
	]);
};

export default clearSingle;
