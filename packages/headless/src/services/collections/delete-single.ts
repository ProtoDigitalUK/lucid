import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	key: string;
	type?: "single-builder" | "multiple-builder";
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteCollection = await serviceConfig.db
		.deleteFrom("headless_collections")
		.where("key", "=", data.key)
		.executeTakeFirst();

	if (deleteCollection.numDeletedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("collection"),
			}),
			message: T("deletion_error_message", {
				name: T("collection").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
