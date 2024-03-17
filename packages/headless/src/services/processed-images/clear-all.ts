import s3Services from "../s3/index.js";

const clearAll = async (serviceConfig: ServiceConfigT) => {
	const allProcessedImages = await serviceConfig.db
		.selectFrom("headless_processed_images")
		.select("key")
		.execute();

	if (allProcessedImages.length === 0) return;

	await Promise.all([
		s3Services.deleteObjects({
			objects: allProcessedImages.map((image) => ({
				key: image.key,
			})),
		}),
		serviceConfig.db.deleteFrom("headless_processed_images").execute(),
	]);
};

export default clearAll;
