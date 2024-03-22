import T from "../../translations/index.js";
import z from "zod";
import { APIError } from "../../utils/app/error-handler.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import multiplePageSchema from "../../schemas/multiple-page.js";
import formatMultiplePage from "../../format/format-multiple-page.js";
import collectionBricksServices from "../collection-bricks/index.js";
import collectionsServices from "../collections/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	id: number;
	language_id?: number;
	query: z.infer<typeof multiplePageSchema.getSingle.query>;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const page = await serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.select((eb) => [
			"headless_collection_multiple_page.id",
			"headless_collection_multiple_page.parent_id",
			"headless_collection_multiple_page.collection_key",
			"headless_collection_multiple_page.slug",
			"headless_collection_multiple_page.full_slug",
			"headless_collection_multiple_page.homepage",
			"headless_collection_multiple_page.created_by",
			"headless_collection_multiple_page.created_at",
			"headless_collection_multiple_page.updated_at",
			"headless_collection_multiple_page.published",
			"headless_collection_multiple_page.published_at",
			"headless_collection_multiple_page.title_translation_key_id",
			"headless_collection_multiple_page.excerpt_translation_key_id",
			jsonArrayFrom(
				eb
					.selectFrom("headless_translations")
					.select([
						"headless_translations.value",
						"headless_translations.language_id",
					])
					.where("headless_translations.value", "is not", null)
					.whereRef(
						"headless_translations.translation_key_id",
						"=",
						"headless_collection_multiple_page.title_translation_key_id",
					),
			).as("title_translations"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_translations")
					.select([
						"headless_translations.value",
						"headless_translations.language_id",
					])
					.where("headless_translations.value", "is not", null)
					.whereRef(
						"headless_translations.translation_key_id",
						"=",
						"headless_collection_multiple_page.excerpt_translation_key_id",
					),
			).as("excerpt_translations"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_collection_multiple_page_categories")
					.select("category_id")
					.whereRef(
						"headless_collection_multiple_page_categories.collection_multiple_page_id",
						"=",
						"headless_collection_multiple_page.id",
					),
			).as("categories"),
		])
		.innerJoin(
			"headless_users",
			"headless_users.id",
			"headless_collection_multiple_page.created_by",
		)
		.select([
			"headless_users.id as author_id",
			"headless_users.email as author_email",
			"headless_users.first_name as author_first_name",
			"headless_users.last_name as author_last_name",
			"headless_users.username as author_username",
		])
		.where("headless_collection_multiple_page.id", "=", data.id)
		.where("headless_collection_multiple_page.is_deleted", "=", false)
		.executeTakeFirst();

	if (page === undefined || page.collection_key === null) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("page"),
			}),
			message: T("error_not_found_message", {
				name: T("page"),
			}),
			status: 404,
		});
	}

	const collection = await collectionsServices.getSingle({
		key: page.collection_key,
		no_bricks: true,
	});

	if (data.query.include?.includes("bricks") && data.language_id) {
		const bricks = await serviceWrapper(
			collectionBricksServices.getMultiple,
			false,
		)(serviceConfig, {
			id: data.id,
			type: "builder",
			multiple: true,
			language_id: data.language_id,
			collection_key: page.collection_key,
		});
		return formatMultiplePage(page, collection, bricks);
	}

	return formatMultiplePage(page, collection);
};

export default getSingle;
