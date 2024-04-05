import type { FieldSchemaT } from "../schemas/collection-fields.js";
import type {
	PageLinkValueT,
	LinkValueT,
	FieldResMetaT,
} from "@headless/types/src/bricks.js";
import type { MediaTypeT } from "../types/response.js";
import type { RequestQueryParsedT } from "../middleware/validate-query.js";
import type {
	FieldTypesT,
	CustomFieldT,
} from "../libs/builders/field-builder/types.js";
import type { FieldPropT } from "../libs/formatters/collection-document-fields.js";
import type { FieldResValueT } from "@headless/types/src/bricks.js";
import type { FieldFiltersT } from "../libs/builders/collection-builder/index.js";
import type { BrickSchemaT } from "../schemas/collection-bricks.js";
import type { GroupsResT } from "../services/collection-document-bricks/upsert-multiple-groups.js";
import Formatter from "../libs/formatters/index.js";
import mediaHelpers from "./media-helpers.js";

export const fieldTypeValueKey = (type: FieldTypesT) => {
	switch (type) {
		case "text":
			return "text_value";
		case "wysiwyg":
			return "text_value";
		case "media":
			return "media_id";
		case "number":
			return "int_value";
		case "checkbox":
			return "bool_value";
		case "select":
			return "text_value";
		case "textarea":
			return "text_value";
		case "json":
			return "json_value";
		case "pagelink":
			return "page_link_id";
		case "link":
			return "text_value";
		case "datetime":
			return "text_value";
		case "colour":
			return "text_value";
		default:
			return "text_value";
	}
};

export const fieldColumnValueMap = (field: FieldSchemaT) => {
	switch (field.type) {
		case "link": {
			const value = field.value as LinkValueT | undefined;
			if (!value) {
				return {
					text_value: null,
					json_value: null,
				};
			}
			return {
				text_value: value.url,
				json_value: Formatter.stringifyJSON({
					target: value.target,
					label: value.label,
				}),
			};
		}
		case "pagelink": {
			const value = field.value as PageLinkValueT | undefined;
			if (!value) {
				return {
					page_link_id: null,
					json_value: null,
				};
			}
			return {
				page_link_id: value.id,
				json_value: Formatter.stringifyJSON({
					target: value.target,
					label: value.label,
				}),
			};
		}
		default: {
			return {
				[fieldTypeValueKey(field.type)]: field.value,
			};
		}
	}
};

export interface CollectionFiltersResT {
	key: string;
	value: string | string[];
	column: string;
}
export const collectionFilters = (
	allowed_filters: FieldFiltersT,
	filter: RequestQueryParsedT["filter"],
): Array<CollectionFiltersResT> => {
	const values = typeof filter?.cf === "string" ? [filter?.cf] : filter?.cf;
	if (!values) return [];

	const filterKeyValues: Array<CollectionFiltersResT> = [];

	for (const field of allowed_filters) {
		const filterValue = values.filter((filter) =>
			filter.startsWith(`${field.key}=`),
		);

		if (filterValue) {
			const keyValues = filterValue
				.map((filter) => filter.split("=")[1])
				.filter((v) => v !== "");

			if (keyValues.length === 0) continue;

			filterKeyValues.push({
				key: field.key,
				value: keyValues.length > 1 ? keyValues : keyValues[0],
				column: fieldTypeValueKey(field.type),
			});
		}
	}

	return filterKeyValues;
};

interface FieldResponseValueFormatT {
	type: FieldTypesT;
	builder_field: CustomFieldT;
	field: FieldPropT;
	host: string;
}
export const fieldResponseValueFormat = (props: FieldResponseValueFormatT) => {
	let value: FieldResValueT = null;
	let meta: FieldResMetaT = null;

	switch (props.type) {
		case "tab": {
			break;
		}
		case "text": {
			value = props.field?.text_value ?? props.builder_field?.default;
			break;
		}
		case "wysiwyg": {
			value = props.field?.text_value ?? props.builder_field?.default;
			break;
		}
		case "media": {
			value = props.field?.media_id ?? undefined;
			meta = {
				id: props.field?.media_id ?? undefined,
				url: mediaHelpers.createURL(
					props.host,
					props.field?.media_key ?? "",
				),
				key: props.field?.media_key ?? undefined,
				mime_type: props.field?.media_mime_type ?? undefined,
				file_extension: props.field?.media_file_extension ?? undefined,
				file_size: props.field?.media_file_size ?? undefined,
				width: props.field?.media_width ?? undefined,
				height: props.field?.media_height ?? undefined,
				title_translations: props.field?.media_title_translations,
				alt_translations: props.field?.media_alt_translations,
				type: (props.field?.media_type as MediaTypeT) ?? undefined,
			};
			break;
		}
		case "number": {
			value = props.field?.int_value ?? props.builder_field?.default;
			break;
		}
		case "checkbox": {
			value =
				props.field?.bool_value ?? props.builder_field?.default ? 1 : 0;
			break;
		}
		case "select": {
			value = props.field?.text_value ?? props.builder_field?.default;
			break;
		}
		case "textarea": {
			value = props.field?.text_value ?? props.builder_field?.default;
			break;
		}
		case "json": {
			value =
				Formatter.parseJSON<Record<string, unknown>>(
					props.field?.json_value,
				) ?? props.builder_field?.default;
			break;
		}
		case "colour": {
			value = props.field?.text_value ?? props.builder_field?.default;
			break;
		}
		case "datetime": {
			value = props.field?.text_value ?? props.builder_field?.default;
			break;
		}
		case "pagelink": {
			const jsonVal = Formatter.parseJSON<PageLinkValueT>(
				props.field?.json_value,
			);
			value = {
				id: props.field?.page_link_id ?? undefined,
				target: jsonVal?.target || "_self",
				label: jsonVal?.label || "",
			};
			// meta = {};
			break;
		}
		case "link": {
			const jsonVal = Formatter.parseJSON<LinkValueT>(
				props.field?.json_value,
			);
			value = {
				url:
					props.field?.text_value ??
					props.builder_field?.default ??
					"",
				target: jsonVal?.target ?? "_self",
				label: jsonVal?.label ?? undefined,
			};
			break;
		}
	}

	return { value, meta };
};

interface FieldUpsertObjectResT {
	fields_id?: number | undefined;
	collection_brick_id: number;
	key: string;
	type: FieldTypesT;
	group_id?: number | null;
	text_value: string | null;
	int_value: number | null;
	bool_value: 1 | 0 | null;
	json_value: string | null;
	page_link_id: number | null;
	media_id: number | null;
	language_id: number;
}

interface FormatUpsertFieldsT {
	brick: BrickSchemaT;
	groups: Array<GroupsResT>;
}

export const fieldUpsertPrep = (
	props: FormatUpsertFieldsT,
): Array<FieldUpsertObjectResT> => {
	return (
		props.brick.fields?.map((field) => {
			let groupId = null;
			const findGroup = props.groups.find(
				(group) => group.ref === field.group_id,
			);
			if (findGroup === undefined) {
				const findGroupBrick = props.groups.find(
					(group) => group.group_id === field.group_id,
				);
				groupId = findGroupBrick?.group_id ?? null;
			} else groupId = findGroup.group_id;

			return {
				language_id: field.language_id,
				fields_id: field.fields_id,
				collection_brick_id: props.brick.id as number,
				key: field.key,
				type: field.type,
				group_id: groupId,
				text_value: null,
				int_value: null,
				bool_value: null,
				json_value: null,
				page_link_id: null,
				media_id: null,
				...fieldColumnValueMap(field),
			};
		}) || []
	);
};
