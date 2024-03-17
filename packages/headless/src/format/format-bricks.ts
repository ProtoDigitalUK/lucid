import type { CollectionResT } from "@headless/types/src/collections.js";
import type {
	BrickResT,
	CustomFieldT,
	FieldTypesT,
	BrickFieldValueT,
	BrickFieldMetaT,
} from "@headless/types/src/bricks.js";
import type { MediaTypeT } from "@headless/types/src/media.js";
import type { JsonValue } from "kysely-codegen";
import { type BrickBuilderT } from "../builders/brick-builder/index.js";
import { createURL } from "./format-media.js";
import { formatPageFullSlug } from "./format-multiple-page.js";

export interface BrickQueryT {
	id: number;
	brick_key: string;
	brick_order: number;
	brick_type: string;
	multiple_page_id: number | null;
	single_page_id: number | null;
	groups: Array<{
		group_id: number;
		parent_group_id: number | null;
		collection_brick_id: number | null;
		language_id: number;
		repeater_key: string;
		group_order: number;
		ref: string | null;
	}>;
	fields: Array<BrickQueryFieldT>;
}
export interface BrickQueryFieldT {
	fields_id: number;
	collection_brick_id: number | null;
	group_id: number | null;
	language_id: number;
	key: string;
	type: string;
	text_value: string | null;
	int_value: number | null;
	bool_value: boolean | null;
	json_value: JsonValue | null;
	page_link_id: number | null;
	media_id: number | null;
	page_id: number | null;
	page_slug: string | null;
	page_full_slug: string | null;
	page_collection_slug: string | null;
	page_title_translations: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	media_key: string | null;
	media_mime_type: string | null;
	media_file_extension: string | null;
	media_file_size: number | null;
	media_width: number | null;
	media_height: number | null;
	media_type: string | null;
	media_title_translations: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	media_alt_translations: Array<{
		value: string | null;
		language_id: number | null;
	}>;
}

const formatBricks = (data: {
	bricks: BrickQueryT[];
	collection: CollectionResT;
	brick_instances: BrickBuilderT[];
	host: string;
}): BrickResT[] => {
	return data.bricks
		.filter((brick) => {
			const instance = data.brick_instances.find((instance) => {
				return instance.key === brick.brick_key;
			});
			if (!instance) return false;

			const collectionInstance = data.collection.bricks?.find(
				(assignedBrick) => {
					return (
						assignedBrick.key === brick.brick_key &&
						assignedBrick.type === brick.brick_type
					);
				},
			);
			if (!collectionInstance) return false;

			return true;
		})
		.map((brick) => {
			const instance = data.brick_instances.find((instance) => {
				return instance.key === brick.brick_key;
			});

			return {
				id: brick.id,
				key: brick.brick_key,
				order: brick.brick_order,
				type: brick.brick_type as "builder" | "fixed",
				groups: formatGroups(brick.groups),
				fields: formatFields(brick.fields, data.host, instance),
			};
		});
};

const formatFields = (
	fields: BrickQueryFieldT[],
	host: string,
	brick_instance?: BrickBuilderT,
): BrickResT["fields"] => {
	const fieldsRes: BrickResT["fields"] = [];

	const instanceFields = brick_instance?.flatFields;
	if (!instanceFields) return fieldsRes;

	for (const instanceField of instanceFields) {
		const fieldData = fields.filter((f) => f.key === instanceField.key);

		for (const field of fieldData) {
			const { value, meta } = customFieldValues(
				instanceField.type,
				instanceField,
				field,
				host,
			);

			if (field.type === "tab") continue;
			if (field.type === "repeater") continue;

			if (field) {
				const fieldsData: BrickResT["fields"][0] = {
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

const formatGroups = (groups: BrickQueryT["groups"]): BrickResT["groups"] =>
	groups.map((group) => {
		return {
			group_id: group.group_id,
			group_order: group.group_order,
			repeater_key: group.repeater_key,
			parent_group_id: group.parent_group_id,
			language_id: group.language_id,
		};
	});

const customFieldValues = (
	type: FieldTypesT,
	builderField: CustomFieldT,
	field: BrickQueryFieldT,
	host: string,
) => {
	let value: BrickFieldValueT = null;
	let meta: BrickFieldMetaT = null;

	switch (type) {
		case "tab": {
			break;
		}
		case "text": {
			value = field?.text_value ?? builderField?.default;
			break;
		}
		case "wysiwyg": {
			value = field?.text_value ?? builderField?.default;
			break;
		}
		case "media": {
			value = field?.media_id ?? undefined;
			meta = {
				id: field?.media_id ?? undefined,
				url: createURL(host, field?.media_key ?? ""),
				key: field?.media_key ?? undefined,
				mime_type: field?.media_mime_type ?? undefined,
				file_extension: field?.media_file_extension ?? undefined,
				file_size: field?.media_file_size ?? undefined,
				width: field?.media_width ?? undefined,
				height: field?.media_height ?? undefined,
				title_translations: field?.media_title_translations,
				alt_translations: field?.media_alt_translations,
				type: (field?.media_type as MediaTypeT) ?? undefined,
			};
			break;
		}
		case "number": {
			value = field?.int_value ?? builderField?.default;
			break;
		}
		case "checkbox": {
			value = field?.bool_value ?? builderField?.default;
			break;
		}
		case "select": {
			value = field?.text_value ?? builderField?.default;
			break;
		}
		case "textarea": {
			value = field?.text_value ?? builderField?.default;
			break;
		}
		case "json": {
			value =
				(field?.json_value as Record<string, unknown>) ??
				builderField?.default;
			break;
		}
		case "colour": {
			value = field?.text_value ?? builderField?.default;
			break;
		}
		case "datetime": {
			value = field?.text_value ?? builderField?.default;
			break;
		}
		case "pagelink": {
			const jsonVal = field?.json_value as Record<string, unknown> | null;
			value = {
				id: field?.page_link_id ?? undefined,
				target: jsonVal?.target || "_self",
				label:
					jsonVal?.label ||
					defaultTranslationValue(
						field?.page_title_translations,
						field.language_id,
					),
			};
			meta = {
				slug: field?.page_slug ?? undefined,
				full_slug:
					formatPageFullSlug(
						field?.page_full_slug,
						field?.page_collection_slug,
					) ?? undefined,
				collection_slug: field?.page_collection_slug ?? undefined,
				title_translations: field?.page_title_translations,
			};
			break;
		}
		case "link": {
			const jsonVal = field?.json_value as Record<string, unknown> | null;
			value = {
				url: field?.text_value ?? builderField?.default ?? "",
				target: jsonVal?.target ?? "_self",
				label: jsonVal?.label ?? undefined,
			};
			break;
		}
	}

	return { value, meta };
};

const defaultTranslationValue = (
	translations: Array<{
		language_id: number | null;
		value: string | null;
	}>,
	language_id: number,
) => {
	const translation = translations.find((t) => t.language_id === language_id);
	return translation?.value ?? undefined;
};

export const swaggerBrickRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		id: {
			type: "number",
		},
		key: {
			type: "string",
		},
		order: {
			type: "number",
		},
		type: {
			type: "string",
			enum: ["builder", "fixed"],
		},
		groups: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: true,
				properties: {
					group_id: {
						type: "number",
					},
					group_order: {
						type: "number",
					},
					parent_group_id: {
						type: "number",
						nullable: true,
					},
					repeater_key: {
						type: "string",
					},
					language_id: {
						type: "number",
					},
				},
			},
		},
		fields: {
			type: "array",
			items: {
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
			},
		},
	},
};

export default formatBricks;
