import z from "zod";
import formatMedia from "../../format/format-media.js";
import mediaSchema from "../../schemas/media.js";
import { parseCount } from "../../utils/app/helpers.js";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import queryBuilder from "../../db/query-builder.js";
import getConfig from "../../services/config.js";

export interface ServiceData {
	query: z.infer<typeof mediaSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();

	const mediasQuery = serviceConfig.db
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
		.where("visible", "=", true);

	const mediasCountQuery = serviceConfig.db
		.selectFrom("headless_media")
		.select(sql`count(*)`.as("count"))
		.where("visible", "=", true);

	const { main, count } = queryBuilder(
		{
			main: mediasQuery,
			count: mediasCountQuery,
		},
		{
			requestQuery: {
				filter: data.query.filter,
				sort: data.query.sort,
				include: data.query.include,
				exclude: data.query.exclude,
				page: data.query.page,
				per_page: data.query.per_page,
			},
			meta: {
				filters: [
					// {
					// 	queryKey: "title",
					// 	tableKey: "title",
					// 	operator: "%",
					// },
					{
						queryKey: "key",
						tableKey: "key",
						operator: "=",
					},
					{
						queryKey: "mime_type",
						tableKey: "mime_type",
						operator: "=",
					},
					{
						queryKey: "type",
						tableKey: "type",
						operator: "=",
					},
					{
						queryKey: "file_extension",
						tableKey: "file_extension",
						operator: "=",
					},
				],
				sorts: [
					// {
					//     queryKey: "title",
					//     tableKey: "title",
					// },
					{
						queryKey: "created_at",
						tableKey: "created_at",
					},
					{
						queryKey: "updated_at",
						tableKey: "updated_at",
					},
					{
						queryKey: "file_size",
						tableKey: "file_size",
					},
					{
						queryKey: "width",
						tableKey: "width",
					},
					{
						queryKey: "height",
						tableKey: "height",
					},
					{
						queryKey: "mime_type",
						tableKey: "mime_type",
					},
					{
						queryKey: "file_extension",
						tableKey: "file_extension",
					},
				],
			},
		},
	);

	const medias = await main.execute();
	const mediasCount = (await count?.executeTakeFirst()) as
		| { count: string }
		| undefined;

	return {
		data: medias.map((media) => formatMedia(media, config.host)),
		count: parseCount(mediasCount?.count),
	};
};

export default getMultiple;
