import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import formatCollection from "../../format/format-collection.js";
import getConfig from "../config.js";

export interface ServiceData {
	key: string;
	type?: "single-builder" | "multiple-builder";
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collectionQuery = serviceConfig.db
		.selectFrom("headless_collections")
		.select((eb) => [
			"key",
			"title",
			"singular",
			"description",
			"type",
			"slug",
			"created_at",
			"updated_at",
			"disable_homepages",
			"disable_parents",
			jsonArrayFrom(
				eb
					.selectFrom("headless_collections_bricks")
					.select([
						"headless_collections_bricks.key",
						"headless_collections_bricks.type",
						"headless_collections_bricks.position",
					])
					.whereRef(
						"headless_collections_bricks.collection_key",
						"=",
						"headless_collections.key",
					),
			).as("bricks"),
		])
		.where("key", "=", data.key);

	if (data.type) {
		collectionQuery.where("type", "=", data.type);
	}

	const collection = await collectionQuery.executeTakeFirst();

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

	const config = await getConfig();
	return formatCollection(collection, config.bricks);
};

export default getSingle;
