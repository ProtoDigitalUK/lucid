import { sql } from "kysely";
import { parseCount } from "../../utils/helpers.js";

export interface ServiceData {
	key: string;
}

const getSingleCount = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const processedImageCount = (await serviceConfig.config.db.client
		.selectFrom("headless_processed_images")
		.select(sql`count(*)`.as("count"))
		.where("media_key", "=", data.key)
		.executeTakeFirst()) as { count: string };

	return parseCount(processedImageCount.count);
};

export default getSingleCount;
