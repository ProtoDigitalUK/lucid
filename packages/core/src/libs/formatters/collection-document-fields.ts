import type { FieldResponse } from "../../types/response.js";
import type { JSONString } from "../db/types.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";
import type BrickBuilder from "../builders/brick-builder/index.js";
import type { FieldTypes } from "../builders/field-builder/index.js";
import type { BrickPropT } from "./collection-document-bricks.js";
import type { CustomField } from "../builders/field-builder/index.js";
import { fieldResponseValueFormat } from "../../utils/field-helpers.js";

export interface FieldProp {
	fields_id: number;
	collection_brick_id: number | null;
	collection_document_id: number;
	group_id?: number | null;
	language_id: number;
	key: string;
	type: string;
	text_value: string | null;
	int_value: number | null;
	bool_value: 1 | 0 | null;
	json_value?: JSONString | null;
	page_link_id?: number | null;
	user_id?: number | null;
	user_email?: string | null;
	user_first_name?: string | null;
	user_last_name?: string | null;
	user_username?: string | null;
	media_id?: number | null;
	page_id?: number | null;
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

export default class CollectionDocumentFieldsFormatter {
	formatMultiple = (props: {
		fields: FieldProp[];
		groups: BrickPropT["groups"];
		host: string;
		builder: BrickBuilder | CollectionBuilder;
	}): FieldResponse[] => {
		const fieldTree = props.builder.fieldTreeNoTab;
		const sortedGroups = props.groups.sort(
			(a, b) => a.group_order - b.group_order,
		);
		return this.buildFields({
			fields: props.fields,
			groups: sortedGroups,
			host: props.host,
			customFields: fieldTree,
			groupId: null,
			parentGroupId: null,
		});
	};
	formatMultipleFlat = (props: {
		fields: FieldProp[];
		host: string;
		builder: BrickBuilder | CollectionBuilder;
	}): FieldResponse[] => {
		if (props.fields.length === 0) return [];
		const fieldsRes: FieldResponse[] = [];
		const flatFields = props.builder.flatFields;

		for (const cf of flatFields) {
			const fieldData = props.fields.filter((f) => f.key === cf.key);

			for (const field of fieldData) {
				const { value, meta } = fieldResponseValueFormat({
					type: cf.type,
					customField: cf,
					field: field,
					host: props.host,
				});

				if (field.type === "tab") continue;
				if (field.type === "repeater") continue;

				fieldsRes.push({
					key: field.key,
					type: field.type as FieldTypes,
					languageId: field.language_id,
					groupId: field.group_id ?? undefined,
					value: value,
					meta: meta,
				});
			}
		}

		return fieldsRes;
	};
	private buildFields = (props: {
		fields: FieldProp[];
		groups: BrickPropT["groups"];
		host: string;
		customFields: CustomField[];
		groupId: number | null;
		parentGroupId: number | null;
	}): FieldResponse[] => {
		const fieldsRes: FieldResponse[] = [];
		for (const cf of props.customFields) {
			// if the field is a repeater, call buildFieldTree recursively on its fields
			if (cf.type === "repeater") {
				fieldsRes.push({
					key: cf.key,
					type: cf.type,
					groups: this.buildGroups({
						repeater: cf,
						fields: props.fields,
						groups: props.groups,
						host: props.host,
						parentGroupId: props.groupId,
					}),
				});
				continue;
			}

			const fields = props.fields.filter(
				(f) => f.key === cf.key && f.group_id === props.groupId,
			);
			if (!fields) continue;

			for (const field of fields) {
				const { value, meta } = fieldResponseValueFormat({
					type: cf.type,
					customField: cf,
					field: field,
					host: props.host,
				});

				fieldsRes.push({
					key: field.key,
					type: field.type as FieldTypes,
					languageId: field.language_id,
					value: value,
					meta: meta,
				});
			}
		}

		return fieldsRes;
	};
	private buildGroups = (props: {
		fields: FieldProp[];
		repeater: CustomField;
		groups: BrickPropT["groups"];
		host: string;
		parentGroupId: number | null;
	}): FieldResponse[][] => {
		const groups: FieldResponse[][] = [];

		const repeaterFields = props.repeater.fields;
		if (!repeaterFields) return groups;

		const repeaterGroups = props.groups.filter(
			(g) =>
				g.repeater_key === props.repeater.key &&
				g.parent_group_id === props.parentGroupId,
		);

		for (const group of repeaterGroups) {
			groups.push(
				this.buildFields({
					fields: props.fields,
					groups: props.groups,
					host: props.host,
					customFields: repeaterFields,
					groupId: group.group_id,
					parentGroupId: group.parent_group_id,
				}),
			);
		}

		return groups;
	};
	static swagger = {
		type: "object",
		additionalProperties: true,
		properties: {
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
					"repeater",
					"user",
				],
			},
			groupId: {
				type: "number",
				nullable: true,
			},
			collectionDocumentId: {
				type: "number",
			},
			meta: {
				type: "object",
				additionalProperties: true,
				nullable: true,
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
					mimeType: {
						type: "string",
						nullable: true,
					},
					fileExtension: {
						type: "string",
						nullable: true,
					},
					fileSize: {
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
					titleTranslations: {
						type: "array",
						items: {
							type: "object",
							additionalProperties: true,
							properties: {
								value: {
									type: "string",
									nullable: true,
								},
								languageId: {
									type: "number",
									nullable: true,
								},
							},
						},
					},
					altTranslations: {
						type: "array",
						items: {
							type: "object",
							additionalProperties: true,
							properties: {
								value: {
									type: "string",
									nullable: true,
								},
								languageId: {
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
					email: {
						type: "string",
						nullable: true,
					},
					username: {
						type: "string",
						nullable: true,
					},
					firstName: {
						type: "string",
						nullable: true,
					},
					lastName: {
						type: "string",
						nullable: true,
					},
				},
			},
			groups: {
				type: "array",
			},
		},
	};
}
