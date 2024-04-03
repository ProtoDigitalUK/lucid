import s3Services from "../s3/index.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	key: string;
}

const clearSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const ProcessedImagesRepo = RepositoryFactory.getRepository(
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
		s3Services.deleteObjects({
			objects: allProcessedImages.map((image) => ({
				key: image.key,
			})),
		}),
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
