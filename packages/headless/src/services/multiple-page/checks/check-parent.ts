import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";

/*
    Checks:
    - If the parent exists
    - If the page we're creating is a homepage
    - If the parent is the homepage (homepages cannot be parents and have children pages as by default all documents are children of the homepage)
    - If the parent is in the same collection as the child
*/

export interface ServiceData {
	collection_key: string;
	parent_id?: number;
	homepage?: boolean;
}

const checkParent = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.parent_id) return undefined;
	if (data.homepage) return undefined;

	const parentDocument = await serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.select(["homepage"])
		.where("id", "=", data.parent_id)
		.where("collection_key", "=", data.collection_key)
		.executeTakeFirst();

	if (parentDocument === undefined) {
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
					message: T("error_not_found_message", {
						name: T("parent"),
					}),
				},
			}),
		});
	}

	if (parentDocument.homepage === true) {
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
					message: T("homepage_parent_error_message"),
				},
			}),
		});
	}

	return data.parent_id;
};

export default checkParent;
