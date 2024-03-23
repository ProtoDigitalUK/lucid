import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatSingleBuilder from "../../format/format-single-builder.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import collectionsServices from "../collections/index.js";

export interface ServiceData {
	language_id?: number;
	collection_key: string;
	user_id: number;
	include_bricks: boolean;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collectionExists =
		await collectionsServices.checks.checkCollectionExists({
			key: data.collection_key,
		});

	if (collectionExists === false) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("collection"),
			}),
			message: T("error_not_found_message", {
				name: T("collection"),
			}),
			status: 404,
		});
	}

	const page = await serviceConfig.db
		.selectFrom("headless_collection_single_builder")
		.select(["id", "collection_key"])
		.where("collection_key", "=", data.collection_key)
		.executeTakeFirst();

	if (page === undefined) {
		const newPage = await serviceConfig.db
			.insertInto("headless_collection_single_builder")
			.values({
				collection_key: data.collection_key,
				updated_by: data.user_id,
			})
			.returning(["id", "collection_key"])
			.executeTakeFirst();

		if (newPage === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_created_name", {
					name: T("page"),
				}),
				message: T("creation_error_message", {
					name: T("page").toLowerCase(),
				}),
				status: 500,
			});
		}

		return formatSingleBuilder(newPage);
	}

	if (!data.include_bricks || data.language_id === undefined) {
		return formatSingleBuilder(page);
	}

	const bricks = await serviceWrapper(
		collectionDocumentBricksServices.getMultiple,
		false,
	)(serviceConfig, {
		id: page.id,
		type: "builder",
		multiple: false,
		language_id: data.language_id,
		collection_key: data.collection_key,
	});

	return formatSingleBuilder(page, bricks);
};

export default getSingle;
