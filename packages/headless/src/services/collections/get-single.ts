import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { CollectionConfigT } from "../../builders/collection-builder/index.js";
import getConfig from "../config.js";
import formatCollection from "../../format/format-collection.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import environmentsServices from "../environments/index.js";
import brickConfigServices from "../brick-config/index.js";

export interface ServiceData {
	collectionKey: string;
	environmentKey: string;
	type?: CollectionConfigT["type"];
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const config = await getConfig();
	const instances = config.collections || [];

	if (!instances.length) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("collection"),
			}),
			message: T("collection_not_found_message", {
				collectionKey: data.collectionKey,
				environmentKey: data.environmentKey,
			}),
			status: 404,
		});
	}

	const collections = instances.map(formatCollection);
	const environment = await serviceWrapper(
		environmentsServices.getSingle,
		false,
	)(serviceConfig, {
		key: data.environmentKey,
	});

	const collection = collections.find((collection) => {
		if (data.type !== undefined) {
			return (
				collection.key === data.collectionKey &&
				collection.type === data.type &&
				environment.assigned_collections.includes(collection.key)
			);
		}
		return (
			collection.key === data.collectionKey &&
			environment.assigned_collections.includes(collection.key)
		);
	});

	if (collection === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("collection"),
			}),
			message: T("collection_not_found_message", {
				collectionKey: data.collectionKey,
				environmentKey: data.environmentKey,
			}),
			status: 404,
		});
	}

	const allowedBricks = await brickConfigServices.getAllowedBricks({
		collection,
		environment,
	});
	collection.bricks = allowedBricks.collectionBricks;

	return {
		collection: collection,
		environment: environment,
	};
};

export default getSingle;
