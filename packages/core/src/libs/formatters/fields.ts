import type { FieldResponse } from "../../types/response.js";
import type { JSONString } from "../db/types.js";
import type CollectionBuilder from "../builders/collection-builder/index.js";
import type BrickBuilder from "../builders/brick-builder/index.js";
import type { FieldTypes } from "../builders/field-builder/index.js";
import type { BrickPropT } from "./bricks.js";
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
		return this.buildFields({
			fields: props.fields,
			groups: props.groups,
			host: props.host,
			customFields: fieldTree,
		});
	};
	private buildFields = (props: {
		fields: FieldProp[];
		groups: BrickPropT["groups"];
		host: string;
		customFields: CustomField[];
	}): FieldResponse[] => {
		const fieldsRes: FieldResponse[] = [];
		for (const cf of props.customFields) {
			const field = props.fields.find((f) => f.key === cf.key);
			if (!field) continue;

			const { value, meta } = fieldResponseValueFormat({
				type: cf.type,
				customField: cf,
				field: field,
				host: props.host,
			});

			// if the field is a repeater, call buildFieldTree recursively on its fields
			if (field.type === "repeater") {
				fieldsRes.push({
					key: field.key,
					type: field.type,
					languageId: field.language_id,
					groups: this.buildGroups({
						fields: props.fields,
						customFields: cf.fields || [],
						groups: props.groups,
						host: props.host,
					}),
				});
				continue;
			}

			fieldsRes.push({
				key: field.key,
				type: field.type as FieldTypes,
				languageId: field.language_id,
				meta: meta,
				value: value,
			});
		}

		return fieldsRes;
	};
	private buildGroups = (props: {
		fields: FieldProp[];
		customFields: CustomField[];
		groups: BrickPropT["groups"];
		host: string;
	}): FieldResponse[][] => {
		const groups: FieldResponse[][] = [];
		console.log(props.customFields);
		return groups;
	};
	// Add swagger
}
