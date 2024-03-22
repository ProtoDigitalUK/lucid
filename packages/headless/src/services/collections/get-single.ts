import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import {
	type CollectionBuilderT,
	type CollectionConfigT,
} from "../../builders/collection-builder/index.js";
import formatCollection from "../../format/format-collection.js";
import getConfig from "../config.js";

export interface ServiceData {
	key: string;
	type?: CollectionConfigT["type"];
	no_bricks?: boolean;
}

const getSingle = async (data: ServiceData) => {
	const config = await getConfig();

	let collection: CollectionBuilderT | undefined;

	if (data.type !== undefined) {
		collection = config.collections?.find(
			(c) => c.key === data.key && c.config.type === data.type,
		);
	} else {
		collection = config.collections?.find((c) => c.key === data.key);
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

	return formatCollection(
		collection,
		data.no_bricks === true ? undefined : config.bricks,
	);
};

export default getSingle;
