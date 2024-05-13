import type {
	FieldResponse,
	FieldGroupResponse,
} from "../../types/response.js";
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
	user_id?: number | null;
	user_email?: string | null;
	user_first_name?: string | null;
	user_last_name?: string | null;
	user_username?: string | null;
	media_id?: number | null;
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
		defaultLanguageId: number | undefined;
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
			defaultLanguageId: props.defaultLanguageId,
		});
	};
	formatMultipleFlat = (props: {
		fields: FieldProp[];
		host: string;
		builder: BrickBuilder | CollectionBuilder;
		defaultLanguageId: number | undefined;
	}): FieldResponse[] => {
		if (props.fields.length === 0) return [];
		const fieldsRes: FieldResponse[] = [];
		const flatFields = props.builder.flatFields;

		for (const cf of flatFields) {
			const fieldData = props.fields
				.filter((f) => f.key === cf.key)
				.filter((f) => {
					if (f.type === "repeater") return false;
					if (f.type === "tab") return false;
					return true;
				});

			if (fieldData.length === 0) continue;

			const field = this.handleFieldLanguages({
				fields: fieldData,
				cf: cf,
				host: props.host,
				includeGroupId: true,
				defaultLanguageId: props.defaultLanguageId,
			});
			if (field) fieldsRes.push(field);
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
		defaultLanguageId: number | undefined;
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
						defaultLanguageId: props.defaultLanguageId,
					}),
				});
				continue;
			}

			const fields = props.fields.filter(
				(f) => f.key === cf.key && f.group_id === props.groupId,
			);
			if (!fields) continue;
			if (fields.length === 0) continue;

			const field = this.handleFieldLanguages({
				fields: fields,
				cf: cf,
				host: props.host,
				includeGroupId: true,
				defaultLanguageId: props.defaultLanguageId,
			});
			if (field) fieldsRes.push(field);
		}

		return fieldsRes;
	};
	private buildGroups = (props: {
		fields: FieldProp[];
		repeater: CustomField;
		groups: BrickPropT["groups"];
		host: string;
		parentGroupId: number | null;
		defaultLanguageId: number | undefined;
	}): FieldGroupResponse[] => {
		const groups: FieldGroupResponse[] = [];

		const repeaterFields = props.repeater.fields;
		if (!repeaterFields) return groups;

		const repeaterGroups = props.groups.filter(
			(g) =>
				g.repeater_key === props.repeater.key &&
				g.parent_group_id === props.parentGroupId,
		);

		for (const group of repeaterGroups) {
			groups.push({
				id: group.group_id,
				order: group.group_order,
				open: group.group_open,
				fields: this.buildFields({
					fields: props.fields,
					groups: props.groups,
					host: props.host,
					customFields: repeaterFields,
					groupId: group.group_id,
					parentGroupId: group.parent_group_id,
					defaultLanguageId: props.defaultLanguageId,
				}),
			});
		}

		return groups;
	};
	private handleFieldLanguages = (props: {
		fields: FieldProp[];
		cf: CustomField;
		host: string;
		includeGroupId?: boolean;
		defaultLanguageId?: number;
	}): FieldResponse | null => {
		if (props.cf.translations === true) {
			return this.reduceFieldLanguages({
				fields: props.fields,
				cf: props.cf,
				host: props.host,
				includeGroupId: props.includeGroupId,
			});
		}
		const defaultField = props.fields.find(
			(f) => f.language_id === props.defaultLanguageId,
		);
		if (!defaultField) return null;

		const { value, meta } = fieldResponseValueFormat({
			type: props.cf.type,
			customField: props.cf,
			field: defaultField,
			host: props.host,
		});
		return {
			key: props.cf.key,
			type: props.cf.type as FieldTypes,
			groupId: props.includeGroupId
				? defaultField.group_id ?? undefined
				: undefined,
			value: value,
			meta: meta,
		};
	};
	private reduceFieldLanguages = (props: {
		fields: FieldProp[];
		cf: CustomField;
		host: string;
		includeGroupId?: boolean;
	}): FieldResponse => {
		// ** Reduce same fields into one entry with translations object containing values for each language
		return props.fields.reduce<FieldResponse>(
			(acc, field) => {
				if (acc.translations === undefined) acc.translations = {};

				if (props.includeGroupId)
					acc.groupId = field.group_id ?? undefined;

				acc.translations[field.language_id] = fieldResponseValueFormat({
					type: props.cf.type,
					customField: props.cf,
					field: field,
					host: props.host,
				});

				return acc;
			},
			{
				key: props.cf.key,
				type: props.cf.type as FieldTypes,
			},
		);
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
			translations: {
				type: "object",
				additionalProperties: true,
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
				items: {
					type: "object",
					additionalProperties: true,
					properties: {
						id: {
							type: "number",
						},
						order: {
							type: "number",
						},
						open: {
							type: "number",
							nullable: true,
						},
						fields: {
							type: "array",
							items: {
								type: "object",
								additionalProperties: true,
							},
						},
					},
				},
			},
		},
	};
}
