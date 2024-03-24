import T from "../../../translations/index.js";
import { APIError } from "../../../utils/error-handler.js";
import getConfig from "../../../libs/config/get-config.js";
import type { ErrorContentT } from "../../../utils/helpers.js";

export interface ServiceData {
	key: string;
	has_slug: boolean;
	has_homepage: boolean;
	has_parent_id: boolean;
	has_category_ids: boolean;
	errorContent: ErrorContentT;
}

const checkCollection = async (data: ServiceData) => {
	const config = await getConfig();

	const collectionInstance = config.collections?.find(
		(c) => c.key === data.key,
	);

	if (!collectionInstance) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: T("error_not_found_message", {
				name: T("collection"),
			}),
			status: 404,
		});
	}

	if (data.has_slug && collectionInstance.data.config.enableSlugs === false) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: T("collection_config_error_message", {
				type: "enableSlugs",
			}),
			status: 400,
		});
	}
	if (
		data.has_homepage &&
		collectionInstance.data.config.enableHomepages === false
	) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: T("collection_config_error_message", {
				type: "enableHomepages",
			}),
			status: 400,
		});
	}
	if (
		data.has_parent_id &&
		collectionInstance.data.config.enableParents === false
	) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: T("collection_config_error_message", {
				type: "enableParents",
			}),
			status: 400,
		});
	}
	if (
		data.has_category_ids &&
		collectionInstance.data.config.enableCategories === false
	) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: T("collection_config_error_message", {
				type: "enableCategories",
			}),
			status: 400,
		});
	}

	return collectionInstance;
};

export default checkCollection;
