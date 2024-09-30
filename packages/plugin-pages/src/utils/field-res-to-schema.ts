import type { FieldSchemaType, CustomFieldMap } from "@lucidcms/core/types";

const fieldResToSchema = (
	key: string,
	enableTranslations: boolean,
	defaultLocale: string,
	items: Array<{
		key: string;
		collection_document_id: number;
		collection_brick_id: number;
		locale_code: string;
		text_value: string | null;
		document_id: number | null;
		type: FieldSchemaType["type"] | keyof CustomFieldMap;
	}>,
): FieldSchemaType => {
	if (items.length === 0) {
		throw new Error("Items array cannot be empty");
	}

	const result: FieldSchemaType = {
		key: key,
		type: "text",
	};

	if (enableTranslations) {
		result.translations = {};
		for (const item of items) {
			if (item.type === "text") {
				result.translations[item.locale_code] = item.text_value;
			} else if (item.type === "document") {
				result.translations[item.locale_code] = item.document_id;
			}
			result.type = item.type as FieldSchemaType["type"];
		}
	} else {
		const defaultItem = items.find(
			(item) => item.locale_code === defaultLocale,
		);
		if (defaultItem) {
			if (defaultItem.type === "text") result.value = defaultItem.text_value;
			else if (defaultItem.type === "document")
				result.value = defaultItem.document_id;
			result.type = defaultItem.type as FieldSchemaType["type"];
		}
	}

	return result;
};

export default fieldResToSchema;
