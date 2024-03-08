import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import slug from "slug";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import categoriesServices from "./index.js";
import languagesServices from "../languages/index.js";
import translationsServices from "../translations/index.js";
import {
	mergeTranslationGroups,
	getUniqueLanguageIDs,
} from "../../utils/translations/helpers.js";

export interface ServiceData {
	collection_key: string;
	slug: string;
	title_translations: {
		language_id: number;
		value: string | null;
	}[];
	description_translations?: {
		language_id: number;
		value: string | null;
	}[];
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const collectionExists = await serviceConfig.db
		.selectFrom("headless_collections")
		.select("key")
		.where("key", "=", data.collection_key)
		.executeTakeFirst();

	if (collectionExists === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("collection"),
			}),
			message: T("error_not_found_message", {
				name: T("collection"),
			}),
			status: 404,
			errors: modelErrors({
				collection_key: {
					code: "not_found",
					message: T("error_not_found_message", {
						name: T("collection"),
					}),
				},
			}),
		});
	}

	const slugValue = slug(data.slug, {
		lower: true,
	});

	const slugExists = await serviceWrapper(
		categoriesServices.checks.checkSlugExists,
		false,
	)(serviceConfig, {
		collection_key: data.collection_key,
		slug: slugValue,
	});

	if (slugExists) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("category"),
			}),
			message: T("creation_error_message", {
				name: T("category").toLowerCase(),
			}),
			status: 400,
			errors: modelErrors({
				slug: {
					code: "duplicate",
					message: T("not_unique_error_message"),
				},
			}),
		});
	}

	await serviceWrapper(languagesServices.checks.checkLanguagesExist, false)(
		serviceConfig,
		{
			language_ids: getUniqueLanguageIDs([
				data.title_translations,
				data.description_translations || [],
			]),
		},
	);

	const translationKeys = await serviceWrapper(
		translationsServices.createMultiple,
		false,
	)(serviceConfig, {
		keys: ["title", "description"],
		translations: mergeTranslationGroups([
			{
				translations: data.title_translations,
				key: "title",
			},
			{
				translations: data.description_translations || [],
				key: "description",
			},
		]),
	});

	const categoryRes = await serviceConfig.db
		.insertInto("headless_collection_categories")
		.values({
			collection_key: data.collection_key,
			slug: slugValue,
			title_translation_key_id: translationKeys.title,
			description_translation_key_id: translationKeys.description,
		})
		.returning("id")
		.executeTakeFirst();

	if (categoryRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("category"),
			}),
			message: T("error_not_created_message", {
				name: T("category"),
			}),
			status: 500,
		});
	}

	return categoryRes.id;
};

export default createSingle;
