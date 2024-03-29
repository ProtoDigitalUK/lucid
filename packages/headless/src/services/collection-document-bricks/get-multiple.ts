import collectionsServices from "../collections/index.js";
import formatCollectionBricks from "../../format/format-collection-bricks.js";

export interface ServiceData {
	document_id: number;
	collection_key: string;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const brickFieldsQuery = serviceConfig.config.db.client
		.selectFrom("headless_collection_document_bricks")
		.select((eb) => [
			"headless_collection_document_bricks.id",
			"headless_collection_document_bricks.brick_type",
			"headless_collection_document_bricks.brick_key",
			"headless_collection_document_bricks.collection_document_id",
			"headless_collection_document_bricks.brick_order",
			serviceConfig.config.db
				.jsonArrayFrom(
					eb
						.selectFrom("headless_collection_document_groups")
						.selectAll()
						.whereRef(
							"headless_collection_document_groups.collection_brick_id",
							"=",
							"headless_collection_document_bricks.id",
						),
				)
				.as("groups"),
			serviceConfig.config.db
				.jsonArrayFrom(
					eb
						.selectFrom("headless_collection_document_fields")
						.leftJoin("headless_collection_documents", (join) =>
							join.onRef(
								"headless_collection_documents.id",
								"=",
								"headless_collection_document_fields.page_link_id",
							),
						)
						.leftJoin("headless_media", (join) =>
							join.onRef(
								"headless_media.id",
								"=",
								"headless_collection_document_fields.media_id",
							),
						)
						.select((eb) => [
							"headless_collection_document_fields.fields_id",
							"headless_collection_document_fields.collection_brick_id",
							"headless_collection_document_fields.group_id",
							"headless_collection_document_fields.language_id",
							"headless_collection_document_fields.key",
							"headless_collection_document_fields.type",
							"headless_collection_document_fields.text_value",
							"headless_collection_document_fields.int_value",
							"headless_collection_document_fields.bool_value",
							"headless_collection_document_fields.json_value",
							"headless_collection_document_fields.page_link_id",
							"headless_collection_document_fields.media_id",
							"headless_collection_document_fields.collection_document_id",
							// Page fields
							"headless_collection_documents.id as page_id",
							"headless_collection_documents.slug as page_slug",
							"headless_collection_documents.full_slug as page_full_slug",
							// Media fields
							"headless_media.key as media_key",
							"headless_media.mime_type as media_mime_type",
							"headless_media.file_extension as media_file_extension",
							"headless_media.file_size as media_file_size",
							"headless_media.width as media_width",
							"headless_media.height as media_height",
							"headless_media.type as media_type",
							serviceConfig.config.db
								.jsonArrayFrom(
									eb
										.selectFrom("headless_translations")
										.select([
											"headless_translations.value",
											"headless_translations.language_id",
										])
										.where(
											"headless_translations.value",
											"is not",
											null,
										)
										.whereRef(
											"headless_translations.translation_key_id",
											"=",
											"headless_media.title_translation_key_id",
										),
								)
								.as("media_title_translations"),
							serviceConfig.config.db
								.jsonArrayFrom(
									eb
										.selectFrom("headless_translations")
										.select([
											"headless_translations.value",
											"headless_translations.language_id",
										])
										.where(
											"headless_translations.value",
											"is not",
											null,
										)
										.whereRef(
											"headless_translations.translation_key_id",
											"=",
											"headless_media.alt_translation_key_id",
										),
								)
								.as("media_alt_translations"),
						])
						.whereRef(
							"headless_collection_document_fields.collection_brick_id",
							"=",
							"headless_collection_document_bricks.id",
						),
				)
				.as("fields"),
		])
		.orderBy("headless_collection_document_bricks.brick_order", "asc")
		.where(
			"headless_collection_document_bricks.collection_document_id",
			"=",
			data.document_id,
		);

	const [bricks, collection] = await Promise.all([
		brickFieldsQuery.execute(),
		collectionsServices.getSingleInstance({
			key: data.collection_key,
		}),
	]);

	return formatCollectionBricks({
		bricks: bricks,
		collection: collection,
		host: serviceConfig.config.host,
	});
};

export default getMultiple;
