import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type {
	CollectionBuilderT,
	CollectionDataT,
} from "../../libs/collection-builder/index.js";
import formatCollection from "../../format/format-collection.js";
import getConfig from "../../libs/config/get-config.js";

export interface ServiceData {
	key: string;
	type?: CollectionDataT["type"];
}

const getSingle = async (data: ServiceData) => {
	const config = await getConfig();

	let collection: CollectionBuilderT | undefined;

	if (data.type !== undefined) {
		collection = config.collections?.find(
			(c) => c.data.key === data.key && c.data.type === data.type,
		);
	} else {
		collection = config.collections?.find((c) => c.data.key === data.key);
	}

	if (collection === undefined) {
		throw new APIError({
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

	return formatCollection(collection, true);
};

export default getSingle;
