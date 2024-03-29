import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/error-handler.js";
import type { ErrorContentT } from "../../../utils/helpers.js";

/*
    Checks:
    - If the parent exists
    - If the document we're creating is a homepage
    - If the parent is the homepage (homepages cannot be parents and have children pages as by default all pages are children of the homepage)
    - If the parent is in the same collection as the child
*/

export interface ServiceData {
	collection_key: string;
	parent_id?: number | null;
	homepage?: 1 | 0;
	current_id?: number;
	errorContent: ErrorContentT;
}

const checkParent = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.parent_id === null) return null;
	if (data.parent_id === undefined) return undefined;
	if (data.homepage === 1) return null;

	if (data.current_id === data.parent_id) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: data.errorContent.message,
			status: 400,
			errors: modelErrors({
				parent_id: {
					code: "invalid",
					message: T("document_cannot_be_parent_of_itself"),
				},
			}),
		});
	}

	const docRes = await serviceConfig.db
		.selectFrom("headless_collection_documents")
		.select(["homepage"])
		.where("id", "=", data.parent_id)
		.where("collection_key", "=", data.collection_key)
		.executeTakeFirst();

	if (docRes === undefined) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: data.errorContent.message,
			status: 400,
			errors: modelErrors({
				parent_id: {
					code: "invalid",
					message: T("error_not_found_message", {
						name: T("document"),
					}),
				},
			}),
		});
	}

	if (docRes.homepage === 1) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: data.errorContent.message,
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
