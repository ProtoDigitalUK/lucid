import T from "../../../translations/index.js";
import { APIError } from "../../../utils/error-handler.js";
import getConfig from "../../../libs/config/get-config.js";
import type { ErrorContentT } from "../../../utils/helpers.js";

export interface ServiceData {
	key: string;
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

	return collectionInstance;
};

export default checkCollection;
