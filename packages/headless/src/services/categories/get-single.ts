import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import formatCategory from "../../format/format-category.js";

export interface ServiceData {
	id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const category = await serviceConfig.db
		.selectFrom("headless_collection_categories")
		.select((eb) => [
			"id",
			"collection_key",
			"title_translation_key_id",
			"description_translation_key_id",
			"slug",
			"created_at",
			"updated_at",
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
						"headless_collection_categories.title_translation_key_id",
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
						"headless_collection_categories.description_translation_key_id",
					),
			).as("description_translations"),
		])
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (category === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("category"),
			}),
			message: T("error_not_found_message", {
				name: T("category"),
			}),
			status: 404,
		});
	}

	return formatCategory(category);
};

export default getSingle;
