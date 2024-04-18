import T from "../../../translations/index.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import getConfig from "../../../libs/config/get-config.js";

export interface ServiceData {
	key: string;
}

const checkCollection = async (data: ServiceData) => {
	const config = await getConfig();

	const collectionInstance = config.collections?.find(
		(c) => c.key === data.key,
	);

	if (!collectionInstance) {
		throw new HeadlessAPIError({
			type: "basic",
			message: T("error_not_found_message", {
				name: T("collection"),
			}),
			status: 404,
		});
	}

	return collectionInstance;
};

export default checkCollection;
