import { sql } from "kysely";
import { parseCount } from "../../utils/app/helpers.js";

// export interface ServiceData {}

const processedImageCount = async (
	serviceConfig: ServiceConfigT,
	// data: ServiceData,
) => {
	const processedImageCount = (await serviceConfig.db
		.selectFrom("headless_processed_images")
		.select(sql`count(*)`.as("count"))
		.executeTakeFirst()) as { count: string };

	return parseCount(processedImageCount.count);
};

export default processedImageCount;
