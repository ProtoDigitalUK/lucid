import T from "../../translations/index.js";
import z from "zod";
import { APIError } from "../../utils/app/error-handler.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import multiplePageSchema from "../../schemas/multiple-page.js";
import formatmultiplePage from "../../format/format-multiple-page.js";

export interface ServiceData {
	id: number;
	query: z.infer<typeof multiplePageSchema.getSingle.query>;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const document = await serviceConfig.db
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
			"headless_collections",
			"headless_collections.key",
			"headless_collection_multiple_page.collection_key",
		)
		.select("headless_collections.slug as collection_slug")
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
		.executeTakeFirst();

	if (document === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("document"),
			}),
			message: T("error_not_found_message", {
				name: T("document"),
			}),
			status: 404,
		});
	}

	return formatmultiplePage(document);
};

export default getSingle;
