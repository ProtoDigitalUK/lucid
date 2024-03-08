import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";

/*
    Checks:
    - If the collection exists
    - If the collection allows homepages
    - If the collection allows parents
*/

export interface ServiceData {
	collection_key: string;
	homepage?: boolean;
	parent_id?: number;
}

const checkCollection = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const collection = await serviceConfig.db
		.selectFrom("headless_collections")
		.select(["key", "disable_homepages", "disable_parents"])
		.where("key", "=", data.collection_key)
		.executeTakeFirst();

	if (collection === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("document"),
			}),
			message: T("error_not_created_message", {
				name: T("document"),
			}),
			status: 400,
			errors: modelErrors({
				collection_key: {
					code: "invalid",
					message: T("duplicate_entry_error_message"),
				},
			}),
		});
	}

	if (collection.disable_homepages === true && data.homepage === true) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("document"),
			}),
			message: T("error_not_created_message", {
				name: T("document"),
			}),
			status: 400,
			errors: modelErrors({
				homepage: {
					code: "invalid",
					message: T("homepage_disabled_error_message"),
				},
			}),
		});
	}

	if (collection.disable_parents === true && data.parent_id !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("document"),
			}),
			message: T("error_not_created_message", {
				name: T("document"),
			}),
			status: 400,
			errors: modelErrors({
				parent_id: {
					code: "invalid",
					message: T("parent_disabled_error_message"),
				},
			}),
		});
	}
};

export default checkCollection;
