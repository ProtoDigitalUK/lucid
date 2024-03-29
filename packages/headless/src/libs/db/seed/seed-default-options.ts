import T from "../../../translations/index.js";
import { InternalError } from "../../../utils/error-handler.js";

const seedDefaultOptions = async (serviceConfig: ServiceConfigT) => {
	try {
		const mediaStorageOption = await serviceConfig.db
			.selectFrom("headless_options")
			.select("name")
			.where("name", "=", "media_storage_used")
			.executeTakeFirst();

		if (mediaStorageOption === undefined) {
			await serviceConfig.db
				.insertInto("headless_options")
				.values({
					name: "media_storage_used",
					value_int: 0,
				})
				.execute();
		}
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("option").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultOptions;
