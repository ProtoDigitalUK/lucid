import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import formatMedia from "../../format/format-media.js";
import getConfig from "../config.js";

export interface ServiceData {
	id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const config = await getConfig();
	const media = await serviceConfig.db
		.selectFrom("headless_media")
		.select((eb) => [
			"id",
			"key",
			"e_tag",
			"type",
			"mime_type",
			"file_extension",
			"file_size",
			"width",
			"height",
			"title_translation_key_id",
			"alt_translation_key_id",
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
						"headless_media.title_translation_key_id",
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
						"headless_media.alt_translation_key_id",
					),
			).as("alt_translations"),
		])
		.where("visible", "=", true)
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (media === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("media"),
			}),
			message: T("error_not_found_message", {
				name: T("media"),
			}),
			status: 404,
		});
	}

	return formatMedia(media, {
		host: config.host,
	});
};

export default getSingle;
