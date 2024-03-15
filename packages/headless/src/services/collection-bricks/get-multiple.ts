import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import getConfig from "../config.js";
import collectionsServices from "../collections/index.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import formatBricks from "../../format/format-bricks.js";

export interface ServiceData {
	id: number;
	type: "multiple-page" | "single-page";
	language_id: number;
	collection_key: string;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let brickFieldsQuery = serviceConfig.db
		.selectFrom("headless_collection_bricks")
		.select((eb) => [
			"headless_collection_bricks.id",
			"headless_collection_bricks.brick_type",
			"headless_collection_bricks.brick_key",
			"headless_collection_bricks.multiple_page_id",
			"headless_collection_bricks.single_page_id",
			"headless_collection_bricks.brick_order",
			jsonArrayFrom(
				eb
					.selectFrom("headless_groups")
					.selectAll()
					.whereRef(
						"headless_groups.collection_brick_id",
						"=",
						"headless_collection_bricks.id",
					),
			).as("groups"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_fields")
					.leftJoin("headless_collection_multiple_page", (join) =>
						join.onRef(
							"headless_collection_multiple_page.id",
							"=",
							"headless_fields.page_link_id",
						),
					)
					.leftJoin(
						"headless_collections",
						"headless_collections.key",
						"headless_collection_multiple_page.collection_key",
					)
					.leftJoin("headless_media", (join) =>
						join.onRef(
							"headless_media.id",
							"=",
							"headless_fields.media_id",
						),
					)
					.select((eb) => [
						"headless_fields.fields_id",
						"headless_fields.collection_brick_id",
						"headless_fields.group_id",
						"headless_fields.language_id",
						"headless_fields.key",
						"headless_fields.type",
						"headless_fields.text_value",
						"headless_fields.int_value",
						"headless_fields.bool_value",
						"headless_fields.json_value",
						"headless_fields.page_link_id",
						"headless_fields.media_id",
						// Page fields
						"headless_collection_multiple_page.id as page_id",
						"headless_collection_multiple_page.slug as page_slug",
						"headless_collection_multiple_page.full_slug as page_full_slug",
						"headless_collections.slug as page_collection_slug",
						jsonArrayFrom(
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
									"headless_collection_multiple_page.title_translation_key_id",
								),
						).as("page_title_translations"),
						// Media fields
						"headless_media.key as media_key",
						"headless_media.mime_type as media_mime_type",
						"headless_media.file_extension as media_file_extension",
						"headless_media.file_size as media_file_size",
						"headless_media.width as media_width",
						"headless_media.height as media_height",
						"headless_media.type as media_type",
						jsonArrayFrom(
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
						).as("media_title_translations"),
						jsonArrayFrom(
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
						).as("media_alt_translations"),
					])
					.whereRef(
						"headless_fields.collection_brick_id",
						"=",
						"headless_collection_bricks.id",
					),
			).as("fields"),
		])
		.orderBy("headless_collection_bricks.brick_order", "asc");

	if (data.type === "multiple-page") {
		brickFieldsQuery = brickFieldsQuery.where(
			"headless_collection_bricks.multiple_page_id",
			"=",
			data.id,
		);
	} else {
		brickFieldsQuery = brickFieldsQuery.where(
			"headless_collection_bricks.single_page_id",
			"=",
			data.id,
		);
	}

	const [bricks, collection, config] = await Promise.all([
		brickFieldsQuery.execute(),
		serviceWrapper(collectionsServices.getSingle, false)(serviceConfig, {
			key: data.collection_key,
			type: data.type,
		}),
		getConfig(),
	]);

	return formatBricks({
		bricks: bricks,
		collection: collection,
		brick_instances: config.bricks || [],
		host: config.host,
	});
};

export default getMultiple;
