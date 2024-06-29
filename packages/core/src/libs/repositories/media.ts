import type z from "zod";
import type {
	BooleanInt,
	HeadlessMedia,
	Select,
	KyselyDB,
} from "../db/types.js";
import { sql } from "kysely";
import type mediaSchema from "../../schemas/media.js";
import type { Config } from "../../types/config.js";
import queryBuilder, {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";

export default class MediaRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// select
	selectSingle = async <K extends keyof Select<HeadlessMedia>>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_media">;
	}) => {
		let query = this.db.selectFrom("lucid_media").select(props.select);

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
			.selectFrom("lucid_media")
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
							.selectFrom("lucid_translations")
							.select([
								"lucid_translations.value",
								"lucid_translations.locale_code",
							])
							.where("lucid_translations.value", "is not", null)
							.whereRef(
								"lucid_translations.translation_key_id",
								"=",
								"lucid_media.title_translation_key_id",
							),
					)
					.as("title_translations"),
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_translations")
							.select([
								"lucid_translations.value",
								"lucid_translations.locale_code",
							])
							.where("lucid_translations.value", "is not", null)
							.whereRef(
								"lucid_translations.translation_key_id",
								"=",
								"lucid_media.alt_translation_key_id",
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
		where: QueryBuilderWhereT<"lucid_media">;
	}) => {
		let query = this.db.selectFrom("lucid_media").select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessMedia>, K>>
		>;
	};
	selectMultipleFiltered = async (props: {
		localeCode: string;
		query: z.infer<typeof mediaSchema.getMultiple.query>;
		config: Config;
	}) => {
		const mediasQuery = this.db
			.selectFrom("lucid_media")
			.select((eb) => [
				"lucid_media.id",
				"lucid_media.key",
				"lucid_media.e_tag",
				"lucid_media.type",
				"lucid_media.mime_type",
				"lucid_media.file_extension",
				"lucid_media.file_size",
				"lucid_media.width",
				"lucid_media.height",
				"lucid_media.title_translation_key_id",
				"lucid_media.alt_translation_key_id",
				"lucid_media.created_at",
				"lucid_media.updated_at",
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_translations")
							.select([
								"lucid_translations.value",
								"lucid_translations.locale_code",
							])
							.where("lucid_translations.value", "is not", null)
							.whereRef(
								"lucid_translations.translation_key_id",
								"=",
								"lucid_media.title_translation_key_id",
							),
					)
					.as("title_translations"),
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_translations")
							.select([
								"lucid_translations.value",
								"lucid_translations.locale_code",
							])
							.where("lucid_translations.value", "is not", null)
							.whereRef(
								"lucid_translations.translation_key_id",
								"=",
								"lucid_media.alt_translation_key_id",
							),
					)
					.as("alt_translations"),
			])
			.leftJoin("lucid_translations as title_translations", (join) =>
				join
					.onRef(
						"title_translations.translation_key_id",
						"=",
						"lucid_media.title_translation_key_id",
					)
					.on(
						"title_translations.locale_code",
						"=",
						props.localeCode,
					),
			)
			.leftJoin("lucid_translations as alt_translations", (join) =>
				join
					.onRef(
						"alt_translations.translation_key_id",
						"=",
						"lucid_media.alt_translation_key_id",
					)
					.on("alt_translations.locale_code", "=", props.localeCode),
			)
			.select([
				"title_translations.value as title_translation_value",
				"alt_translations.value as alt_translation_value",
			])
			.groupBy([
				"lucid_media.id",
				"title_translations.value",
				"alt_translations.value",
			])
			.where("visible", "=", 1);

		const mediasCountQuery = this.db
			.selectFrom("lucid_media")
			.select(sql`count(distinct lucid_media.id)`.as("count"))
			.leftJoin("lucid_translations as title_translations", (join) =>
				join
					.onRef(
						"title_translations.translation_key_id",
						"=",
						"lucid_media.title_translation_key_id",
					)
					.on(
						"title_translations.locale_code",
						"=",
						props.localeCode,
					),
			)
			.leftJoin("lucid_translations as alt_translations", (join) =>
				join
					.onRef(
						"alt_translations.translation_key_id",
						"=",
						"lucid_media.alt_translation_key_id",
					)
					.on("alt_translations.locale_code", "=", props.localeCode),
			)
			.select([
				"title_translations.value as title_translation_value",
				"alt_translations.value as alt_translation_value",
			])
			.where("visible", "=", 1)
			.groupBy(["title_translations.value", "alt_translations.value"]);

		const { main, count } = queryBuilder(
			{
				main: mediasQuery,
				count: mediasCountQuery,
			},
			{
				queryParams: {
					filter: props.query.filter,
					sort: props.query.sort,
					include: props.query.include,
					exclude: props.query.exclude,
					page: props.query.page,
					perPage: props.query.perPage,
				},
				meta: {
					tableKeys: {
						filters: {
							title: "title_translations.value",
							key: "key",
							mimeType: "mime_type",
							type: "type",
							fileExtension: "file_extension",
						},
						sorts: {
							title: "title_translations.value",
							createdAt: "created_at",
							updatedAt: "updated_at",
							fileSize: "file_size",
							width: "width",
							height: "height",
							mimeType: "mime_type",
							fileExtension: "file_extension",
						},
					},
					defaultOperators: {
						title: props.config.db.fuzzOperator,
					},
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
			.insertInto("lucid_media")
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
		where: QueryBuilderWhereT<"lucid_users">;
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
			.updateTable("lucid_media")
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
		where: QueryBuilderWhereT<"lucid_media">;
	}) => {
		let query = this.db
			.deleteFrom("lucid_media")
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
