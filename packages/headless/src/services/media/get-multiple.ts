import type z from "zod";
import formatMedia from "../../format/format-media.js";
import type mediaSchema from "../../schemas/media.js";
import { parseCount } from "../../utils/helpers.js";
import { sql } from "kysely";
import queryBuilder from "../../libs/db/query-builder.js";

export interface ServiceData {
	query: z.infer<typeof mediaSchema.getMultiple.query>;
	language_id: number;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const mediasQuery = serviceConfig.db
		.selectFrom("headless_media")
		.select((eb) => [
			"headless_media.id",
			"headless_media.key",
			"headless_media.e_tag",
			"headless_media.type",
			"headless_media.mime_type",
			"headless_media.file_extension",
			"headless_media.file_size",
			"headless_media.width",
			"headless_media.height",
			"headless_media.title_translation_key_id",
			"headless_media.alt_translation_key_id",
			"headless_media.created_at",
			"headless_media.updated_at",
			serviceConfig.config.db
				.jsonArrayFrom(
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
				)
				.as("title_translations"),
			serviceConfig.config.db
				.jsonArrayFrom(
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
				)
				.as("alt_translations"),
		])
		.leftJoin("headless_translations as title_translations", (join) =>
			join
				.onRef(
					"title_translations.translation_key_id",
					"=",
					"headless_media.title_translation_key_id",
				)
				.on("title_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_translations as alt_translations", (join) =>
			join
				.onRef(
					"alt_translations.translation_key_id",
					"=",
					"headless_media.alt_translation_key_id",
				)
				.on("alt_translations.language_id", "=", data.language_id),
		)
		.select([
			"title_translations.value as title_translation_value",
			"alt_translations.value as alt_translation_value",
		])
		.groupBy([
			"headless_media.id",
			"title_translations.value",
			"alt_translations.value",
		])
		.where("visible", "=", 1);

	const mediasCountQuery = serviceConfig.db
		.selectFrom("headless_media")
		.select(sql`count(*)`.as("count"))
		.leftJoin("headless_translations as title_translations", (join) =>
			join
				.onRef(
					"title_translations.translation_key_id",
					"=",
					"headless_media.title_translation_key_id",
				)
				.on("title_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_translations as alt_translations", (join) =>
			join
				.onRef(
					"alt_translations.translation_key_id",
					"=",
					"headless_media.alt_translation_key_id",
				)
				.on("alt_translations.language_id", "=", data.language_id),
		)
		.select([
			"title_translations.value as title_translation_value",
			"alt_translations.value as alt_translation_value",
		])
		.groupBy([
			"headless_media.id",
			"title_translations.value",
			"alt_translations.value",
		])
		.where("visible", "=", 1);

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
					{
						queryKey: "title",
						tableKey: "title_translations.value",
						operator: serviceConfig.config.db.fuzzOperator,
					},
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
					{
						queryKey: "title",
						tableKey: "title_translations.value",
					},
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

	const [medias, mediasCount] = await Promise.all([
		main.execute(),
		count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
	]);

	return {
		data: medias.map((media) =>
			formatMedia({
				media: media,
				host: serviceConfig.config.host,
			}),
		),
		count: parseCount(mediasCount?.count),
	};
};

export default getMultiple;
