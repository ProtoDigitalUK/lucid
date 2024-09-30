import type { FieldSchemaType, CustomFieldMap } from "@lucidcms/core/types";

const fieldResToSchema = (
	key: string,
	enableTranslations: boolean,
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
			if (item.text_value !== null) {
				result.translations[item.locale_code] = item.text_value;
				result.type = item.type as FieldSchemaType["type"];
			}
		}
	} else {
		const defaultItem = items.find((item) => item.locale_code === "en");
		if (defaultItem && defaultItem.text_value !== null) {
			result.value = defaultItem.text_value;
			result.type = defaultItem.type as FieldSchemaType["type"];
		}
	}

	return result;
};

export default fieldResToSchema;
