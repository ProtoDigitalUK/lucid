import z from "zod";
import type { BooleanInt, HeadlessMedia, Select } from "../libs/db/types.js";
import { sql } from "kysely";
import mediaSchema from "../schemas/media.js";
import type { Config } from "../libs/config/config-schema.js";
import queryBuilder, {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class MediaRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// select
	selectSingle = async <K extends keyof Select<HeadlessMedia>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_media">;
	}) => {
		let query = this.db.selectFrom("headless_media").select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessMedia>, K> | undefined
		>;
	};
	selectSingleById = async (props: {
		id: number;
		config: Config;
	}) => {
		return this.db
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
				props.config.db
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
					.as("title_translations"),
				props.config.db
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
					.as("alt_translations"),
			])
			.where("visible", "=", 1)
			.where("id", "=", props.id)
			.executeTakeFirst();
	};
	selectMultiple = async <K extends keyof Select<HeadlessMedia>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_media">;
	}) => {
		let query = this.db.selectFrom("headless_media").select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessMedia>, K>>
		>;
	};
	selectMultipleFiltered = async (props: {
		languageId: number;
		query: z.infer<typeof mediaSchema.getMultiple.query>;
		config: Config;
	}) => {
		const mediasQuery = this.db
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
				props.config.db
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
					.as("title_translations"),
				props.config.db
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
					.as("alt_translations"),
			])
			.leftJoin("headless_translations as title_translations", (join) =>
				join
					.onRef(
						"title_translations.translation_key_id",
						"=",
						"headless_media.title_translation_key_id",
					)
					.on(
						"title_translations.language_id",
						"=",
						props.languageId,
					),
			)
			.leftJoin("headless_translations as alt_translations", (join) =>
				join
					.onRef(
						"alt_translations.translation_key_id",
						"=",
						"headless_media.alt_translation_key_id",
					)
					.on("alt_translations.language_id", "=", props.languageId),
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

		const mediasCountQuery = this.db
			.selectFrom("headless_media")
			.select(sql`count(*)`.as("count"))
			.leftJoin("headless_translations as title_translations", (join) =>
				join
					.onRef(
						"title_translations.translation_key_id",
						"=",
						"headless_media.title_translation_key_id",
					)
					.on(
						"title_translations.language_id",
						"=",
						props.languageId,
					),
			)
			.leftJoin("headless_translations as alt_translations", (join) =>
				join
					.onRef(
						"alt_translations.translation_key_id",
						"=",
						"headless_media.alt_translation_key_id",
					)
					.on("alt_translations.language_id", "=", props.languageId),
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
					filter: props.query.filter,
					sort: props.query.sort,
					include: props.query.include,
					exclude: props.query.exclude,
					page: props.query.page,
					per_page: props.query.per_page,
				},
				meta: {
					filters: [
						{
							queryKey: "title",
							tableKey: "title_translations.value",
							operator: props.config.db.fuzzOperator,
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

		return await Promise.all([
			main.execute(),
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		key: string;
		visible: BooleanInt;
		eTag?: string;
		type: HeadlessMedia["type"];
		mimeType: string;
		fileExtension: string;
		fileSize: number;
		width?: number | null;
		height?: number | null;
		updatedAt?: string;
		titleTranslationKeyId?: number;
		altTranslationKeyId?: number;
	}) => {
		return this.db
			.insertInto("headless_media")
			.values({
				key: props.key,
				e_tag: props.eTag,
				visible: props.visible,
				type: props.type,
				mime_type: props.mimeType,
				file_extension: props.fileExtension,
				file_size: props.fileSize,
				width: props.width,
				height: props.height,
				title_translation_key_id: props.titleTranslationKeyId,
				alt_translation_key_id: props.altTranslationKeyId,
			})
			.returning("id")
			.executeTakeFirst();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"headless_users">;
		data: {
			key?: string;
			eTag?: string;
			type?: HeadlessMedia["type"];
			mimeType?: string;
			fileExtension?: string;
			fileSize?: number;
			width?: number | null;
			height?: number | null;
			updatedAt?: string;
		};
	}) => {
		let query = this.db
			.updateTable("headless_media")
			.set({
				key: props.data.key,
				e_tag: props.data.eTag,
				type: props.data.type,
				mime_type: props.data.mimeType,
				file_extension: props.data.fileExtension,
				file_size: props.data.fileSize,
				width: props.data.width,
				height: props.data.height,
				updated_at: props.data.updatedAt,
			})
			.returning(["id"]);

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
	// ----------------------------------------
	// delete
	deleteSingle = async (props: {
		where: QueryBuilderWhereT<"headless_media">;
	}) => {
		let query = this.db
			.deleteFrom("headless_media")
			.returning([
				"file_size",
				"id",
				"key",
				"title_translation_key_id",
				"alt_translation_key_id",
			]);

		query = deleteQB(query, props.where);

		return query.executeTakeFirst();
	};
}
