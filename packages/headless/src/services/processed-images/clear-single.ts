import s3Services from "../s3/index.js";

export interface ServiceData {
	key: string;
}

const clearSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const allProcessedImages = await serviceConfig.config.db.client
		.selectFrom("headless_processed_images")
		.select("key")
		.where("media_key", "=", data.key)
		.execute();

	if (allProcessedImages.length === 0) return;

	await Promise.all([
		s3Services.deleteObjects({
			objects: allProcessedImages.map((image) => ({
				key: image.key,
			})),
		}),
		serviceConfig.config.db.client
			.deleteFrom("headless_processed_images")
			.where("media_key", "=", data.key)
			.execute(),
	]);
};

export default clearSingle;
