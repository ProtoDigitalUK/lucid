import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";
import getConfig from "../../config.js";

/*
    Checks:
    - If the collection exists
    - If the collection allows homepages
    - If the collection allows parents
*/

export interface ServiceData {
	collection_key: string;
	homepage?: boolean;
	parent_id?: number | null;
}

const checkCollection = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();
	const collectionInstance = config.collections?.find(
		(c) => c.key === data.collection_key,
	);

	if (collectionInstance === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("page"),
			}),
			message: T("error_not_created_message", {
				name: T("page"),
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

	const collection = collectionInstance.config;

	if (collection.disableHomepages === true && data.homepage === true) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("page"),
			}),
			message: T("error_not_created_message", {
				name: T("page"),
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

	if (
		collection.disableParents === true &&
		data.parent_id !== undefined &&
		data.parent_id !== null
	) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("page"),
			}),
			message: T("error_not_created_message", {
				name: T("page"),
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
