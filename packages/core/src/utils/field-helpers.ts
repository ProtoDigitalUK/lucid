import type z from "zod";
import type { FieldSchema } from "../schemas/collection-fields.js";
import type {
	MediaType,
	FieldResponseValue,
	PageLinkValue,
	LinkValue,
	FieldResponseMeta,
} from "../types/response.js";
import type { RequestQueryParsed } from "../middleware/validate-query.js";
import type {
	FieldTypes,
	CustomField,
} from "../libs/builders/field-builder/types.js";
import type { FieldProp } from "../libs/formatters/collection-document-fields.js";
import type { FieldFilters } from "../libs/builders/collection-builder/index.js";
import Formatter from "../libs/formatters/index.js";
import mediaHelpers from "./media-helpers.js";

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
		case "pagelink":
			if (columns) return "page_link_id";
			return "pageLinkId";
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

export const fieldColumnValueMap = (field: z.infer<typeof FieldSchema>) => {
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
		case "pagelink": {
			const value = field.value as PageLinkValue | undefined;
			if (!value) {
				return {
					pageLinkId: null,
					jsonValue: null,
				};
			}
			return {
				pageLinkId: value.id,
				jsonValue: Formatter.stringifyJSON({
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

export interface CollectionFiltersResponse {
	key: string;
	value: string | string[];
	column: string;
}
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

interface FieldResponseValueFormat {
	type: FieldTypes;
	customField: CustomField;
	field: FieldProp;
	host: string;
}
export const fieldResponseValueFormat = (props: FieldResponseValueFormat) => {
	let value: FieldResponseValue = null;
	let meta: FieldResponseMeta = null;

	switch (props.type) {
		case "tab": {
			break;
		}
		case "text": {
			value = props.field?.text_value ?? props.customField?.default;
			break;
		}
		case "wysiwyg": {
			value = props.field?.text_value ?? props.customField?.default;
			break;
		}
		case "media": {
			value = props.field?.media_id ?? null;
			meta = {
				id: props.field?.media_id ?? null,
				url: mediaHelpers.createURL(
					props.host,
					props.field?.media_key ?? "",
				),
				key: props.field?.media_key ?? null,
				mimeType: props.field?.media_mime_type ?? null,
				fileExtension: props.field?.media_file_extension ?? null,
				fileSize: props.field?.media_file_size ?? null,
				width: props.field?.media_width ?? null,
				height: props.field?.media_height ?? null,
				titleTranslations: props.field?.media_title_translations?.map(
					(t) => ({
						value: t.value,
						languageId: t.language_id,
					}),
				),
				altTranslations: props.field?.media_alt_translations?.map(
					(t) => ({
						value: t.value,
						languageId: t.language_id,
					}),
				),
				type: (props.field?.media_type as MediaType) ?? null,
			};
			break;
		}
		case "number": {
			value = props.field?.int_value ?? props.customField?.default;
			break;
		}
		case "checkbox": {
			value =
				props.field?.bool_value ?? props.customField?.default ? 1 : 0;
			break;
		}
		case "select": {
			value = props.field?.text_value ?? props.customField?.default;
			break;
		}
		case "textarea": {
			value = props.field?.text_value ?? props.customField?.default;
			break;
		}
		case "json": {
			value =
				Formatter.parseJSON<Record<string, unknown>>(
					props.field?.json_value,
				) ?? props.customField?.default;
			break;
		}
		case "colour": {
			value = props.field?.text_value ?? props.customField?.default;
			break;
		}
		case "datetime": {
			value = props.field?.text_value ?? props.customField?.default;
			break;
		}
		case "user": {
			value = props.field?.user_id ?? null;
			meta = {
				email: props.field?.user_email ?? null,
				username: props.field?.user_username ?? null,
				firstName: props.field?.user_first_name ?? null,
				lastName: props.field?.user_last_name ?? null,
			};
			break;
		}
		case "pagelink": {
			const jsonVal = Formatter.parseJSON<PageLinkValue>(
				props.field?.json_value,
			);
			value = {
				id: props.field?.page_link_id ?? null,
				target: jsonVal?.target || "_self",
				label: jsonVal?.label || "",
			};
			// meta = {};
			break;
		}
		case "link": {
			const jsonVal = Formatter.parseJSON<LinkValue>(
				props.field?.json_value,
			);
			value = {
				url:
					props.field?.text_value ?? props.customField?.default ?? "",
				target: jsonVal?.target ?? "_self",
				label: jsonVal?.label ?? null,
			};
			break;
		}
	}

	return { value, meta };
};
