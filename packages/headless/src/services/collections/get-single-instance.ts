import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import getConfig from "../../libs/config/get-config.js";

export interface ServiceData {
	key: string;
}

const getSingleInstance = async (data: ServiceData) => {
	const config = await getConfig();

	const collection = config.collections?.find((c) => c.key === data.key);

	if (collection === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("collection"),
			}),
			message: T("collection_not_found_message", {
				collectionKey: data.key,
			}),
			status: 404,
		});
	}

	return collection;
};

export default getSingleInstance;
