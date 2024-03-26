import type { FieldResT, FieldTypesT } from "@headless/types/src/bricks.js";
import { fieldTypeResponseValue } from "../utils/field-helpers.js";
import type { CollectionBuilderT } from "../libs/collection-builder/index.js";
import type { BrickBuilderT } from "../libs/brick-builder/index.js";
import type { JsonValue } from "kysely-codegen";

export interface FieldQueryDataT {
	fields_id: number;
	collection_brick_id: number | null;
	collection_document_id: number;
	group_id?: number | null;
	language_id: number;
	key: string;
	type: string;
	text_value: string | null;
	int_value: number | null;
	bool_value: boolean | null;
	json_value?: JsonValue | null;
	page_link_id?: number | null;
	media_id?: number | null;
	page_id?: number | null;
	page_slug?: string | null;
	page_full_slug?: string | null;
	media_key?: string | null;
	media_mime_type?: string | null;
	media_file_extension?: string | null;
	media_file_size?: number | null;
	media_width?: number | null;
	media_height?: number | null;
	media_type?: string | null;
	media_title_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	media_alt_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
}

interface FormatFieldsT {
	fields: FieldQueryDataT[];
	host: string;
	collection_slug: string | null | undefined;
	builder: BrickBuilderT | CollectionBuilderT;
}

const formatFields = (props: FormatFieldsT): FieldResT[] => {
	if (props.fields.length === 0) return [];
	const fieldsRes: FieldResT[] = [];

	const instanceFields = props.builder?.flatFields;
	if (!instanceFields) return fieldsRes;

	for (const instanceField of instanceFields) {
		const fieldData = props.fields.filter(
			(f) => f.key === instanceField.key,
		);

		for (const field of fieldData) {
			const { value, meta } = fieldTypeResponseValue(
				instanceField.type,
				instanceField,
				field,
				props.collection_slug,
				props.host,
			);

			if (field.type === "tab") continue;
			if (field.type === "repeater") continue;

			if (field) {
				const fieldsData: FieldResT = {
					fields_id: field.fields_id,
					key: field.key,
					type: field.type as FieldTypesT,
					language_id: field.language_id,
				};
				if (field.group_id) fieldsData.group_id = field.group_id;
				if (meta) fieldsData.meta = meta;
				fieldsData.value = value;

				fieldsRes.push(fieldsData);
			}
		}
	}

	return fieldsRes;
};

export const swaggerFieldRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		fields_id: {
			type: "number",
		},
		key: {
			type: "string",
		},
		type: {
			type: "string",
			enum: [
				"tab",
				"text",
				"wysiwyg",
				"media",
				"number",
				"checkbox",
				"select",
				"textarea",
				"json",
				"colour",
				"datetime",
				"pagelink",
				"link",
			],
		},
		group_id: {
			type: "number",
			nullable: true,
		},
		collection_document_id: {
			type: "number",
		},
		meta: {
			type: "object",
			additionalProperties: true,
			properties: {
				id: {
					type: "number",
					nullable: true,
				},
				url: {
					type: "string",
					nullable: true,
				},
				key: {
					type: "string",
					nullable: true,
				},
				mime_type: {
					type: "string",
					nullable: true,
				},
				file_extension: {
					type: "string",
					nullable: true,
				},
				file_size: {
					type: "number",
					nullable: true,
				},
				width: {
					type: "number",
					nullable: true,
				},
				height: {
					type: "number",
					nullable: true,
				},
				title_translations: {
					type: "array",
					items: {
						type: "object",
						additionalProperties: true,
						properties: {
							value: {
								type: "string",
								nullable: true,
							},
							language_id: {
								type: "number",
								nullable: true,
							},
						},
					},
				},
				alt_translations: {
					type: "array",
					items: {
						type: "object",
						additionalProperties: true,
						properties: {
							value: {
								type: "string",
								nullable: true,
							},
							language_id: {
								type: "number",
								nullable: true,
							},
						},
					},
				},
				type: {
					type: "string",
					nullable: true,
					enum: ["image", "video", "audio", "document"],
				},
				slug: {
					type: "string",
					nullable: true,
				},
				full_slug: {
					type: "string",
					nullable: true,
				},
				collection_slug: {
					type: "string",
					nullable: true,
				},
			},
		},
	},
};

export default formatFields;
