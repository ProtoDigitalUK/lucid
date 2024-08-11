import constants from "../constants.js";
import type {
	Config,
	FieldSchemaType,
	ServiceResponse,
} from "@lucidcms/core/types";
import type { CollectionConfig } from "../types/index.js";

/**
 *  Constructs the fullSlug from the slug and parentPage fields
 */
const constructFullSlug = (data: {
	collection: CollectionConfig;
	parentFields?: Array<{
		key: string;
		collection_document_id: number;
		collection_brick_id: number;
		locale_code: string;
		text_value: string | null;
		document_id: number | null;
	}>;
	localisation: Config["localisation"];
	fields: {
		slug: FieldSchemaType;
	};
}): Awaited<ServiceResponse<Record<string, string | null>>> => {
	// initialise fullSlug with null values for each locale
	const fullSlug: Record<string, string | null> =
		data.localisation.locales.reduce<Record<string, string | null>>(
			(acc, locale) => {
				acc[locale.code] = null;
				return acc;
			},
			{},
		);

	// if translations are enabled/set
	if (data.collection.slug.translations && data.fields.slug.translations) {
		for (let i = 0; i < data.localisation.locales.length; i++) {
			const locale = data.localisation.locales[i];
			if (!locale) continue;

			fullSlug[locale.code] = buildFullSlug({
				parentFields: data.parentFields || [],
				targetLocale: locale.code,
				slug: data.fields.slug.translations[locale.code],
			});
		}
	} else {
		fullSlug[data.localisation.defaultLocale] = buildFullSlug({
			parentFields: data.parentFields || [],
			targetLocale: data.localisation.defaultLocale,
			slug: data.fields.slug.value,
		});
	}

	return {
		error: undefined,
		data: fullSlug,
	};
};

const buildFullSlug = (data: {
	parentFields: Array<{
		key: string;
		collection_document_id: number;
		collection_brick_id: number;
		locale_code: string;
		text_value: string | null;
		document_id: number | null;
	}>;
	targetLocale: string;
	slug: string | null;
}): string | null => {
	if (data.slug === null) return null;
	let result = data.slug;

	const targetParentFullSlugField = data.parentFields.find((field) => {
		return (
			field.locale_code === data.targetLocale &&
			field.key === constants.fields.fullSlug.key
		);
	});

	if (targetParentFullSlugField?.text_value) {
		result = `${targetParentFullSlugField.text_value}/${data.slug}`;
	}

	if (!result.startsWith("/")) {
		result = `/${result}`;
	}

	result = result.replace(/\/\//g, "/");

	return result;
};

export default constructFullSlug;
