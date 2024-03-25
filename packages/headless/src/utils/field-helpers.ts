import type { FieldObjectT } from "../schemas/bricks.js";
import type { PageLinkValueT, LinkValueT } from "@headless/types/src/bricks.js";
import type { RequestQueryParsedT } from "../middleware/validate-query.js";
import type { FieldTypesT } from "../libs/field-builder/types.js";

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

export const fieldColumnValueMap = (field: FieldObjectT) => {
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
				json_value: {
					target: value.target,
					label: value.label,
				},
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
				json_value: {
					target: value.target,
					label: value.label,
				},
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
	allowed_filters: {
		key: string;
		type: FieldTypesT;
	}[],
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
