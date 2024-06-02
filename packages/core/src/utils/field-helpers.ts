import type { LinkValue } from "../types/response.js";
import type { RequestQueryParsed } from "../middleware/validate-query.js";
import type { FieldTypes } from "../libs/builders/field-builder/types.js";
import type { FieldInsertItem } from "../services/collection-document-bricks/helpers/flatten-fields.js";
import type { FieldFilters } from "../libs/builders/collection-builder/index.js";
import Formatter from "../libs/formatters/index.js";

// TODO: move this into individual custom field classes
export const fieldTypeValueKey = (type: FieldTypes, columns?: boolean) => {
	switch (type) {
		case "text":
			if (columns) return "text_value";
			return "textValue";
		case "wysiwyg":
			if (columns) return "text_value";
			return "textValue";
		case "media":
			if (columns) return "media_id";
			return "mediaId";
		case "number":
			if (columns) return "int_value";
			return "intValue";
		case "checkbox":
			if (columns) return "bool_value";
			return "boolValue";
		case "select":
			if (columns) return "text_value";
			return "textValue";
		case "textarea":
			if (columns) return "text_value";
			return "textValue";
		case "json":
			if (columns) return "json_value";
			return "jsonValue";
		case "user":
			if (columns) return "user_id";
			return "userId";
		case "link":
			if (columns) return "text_value";
			return "textValue";
		case "datetime":
			if (columns) return "text_value";
			return "textValue";
		case "colour":
			if (columns) return "text_value";
			return "textValue";
		default:
			if (columns) return "text_value";
			return "textValue";
	}
};

// TODO: move this into individual custom field classes
export const fieldColumnValueMap = (field: FieldInsertItem) => {
	switch (field.type) {
		case "link": {
			const value = field.value as LinkValue | undefined;
			if (!value) {
				return {
					textValue: null,
					jsonValue: null,
				};
			}
			return {
				textValue: value.url,
				jsonValue: Formatter.stringifyJSON({
					target: value.target,
					label: value.label,
				}),
			};
		}
		case "checkbox": {
			if (field.value === 1 || field.value === 0)
				return {
					boolValue: field.value,
				};
			return {
				boolValue: field.value ? 1 : 0,
			};
		}
		case "json": {
			return {
				jsonValue: Formatter.stringifyJSON(field.value),
			};
		}
		default: {
			return {
				[fieldTypeValueKey(field.type)]: field.value,
			};
		}
	}
};

export interface CollectionFiltersResponse {
	key: string;
	value: string | string[];
	column: string;
}
// TODO: Should be moved to collection-builder?
export const collectionDocFilters = (
	allowedFilters: FieldFilters,
	filters: RequestQueryParsed["filter"],
): CollectionFiltersResponse[] => {
	if (!filters) return [];

	return allowedFilters.reduce<CollectionFiltersResponse[]>((acc, field) => {
		const filterValue = filters[field.key];
		if (filterValue === undefined) return acc;

		acc.push({
			key: field.key,
			value: filterValue,
			column: fieldTypeValueKey(field.type, true),
		});

		return acc;
	}, []);
};
