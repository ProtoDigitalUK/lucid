import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import slug from "slug";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import categoriesServices from "./index.js";
import languagesServices from "../languages/index.js";
import translationsServices from "../translations/index.js";
import {
	shouldUpdateTranslations,
	mergeTranslationGroups,
	getUniqueLanguageIDs,
} from "../../utils/translations/helpers.js";

export interface ServiceData {
	id: number;
	slug?: string;
	title_translations?: {
		language_id: number;
		value: string | null;
	}[];
	description_translations?: {
		language_id: number;
		value: string | null;
	}[];
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const categoryRes = await serviceConfig.db
		.selectFrom("headless_collection_categories")
		.select([
			"id",
			"collection_key",
			"slug",
			"title_translation_key_id",
			"description_translation_key_id",
		])
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (categoryRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("category"),
			}),
			message: T("error_not_found_message", {
				name: T("category"),
			}),
			status: 404,
		});
	}

	// Update slug
	let newSlug: string | undefined = undefined;
	if (data.slug !== undefined) {
		newSlug = slug(data.slug, {
			lower: true,
		});

		const slugExists = await serviceWrapper(
			categoriesServices.checks.checkSlugExists,
			false,
		)(serviceConfig, {
			slug: newSlug,
			collection_key: categoryRes.collection_key,
			exclude_id: data.id,
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
	}

	// Update translations
	if (
		shouldUpdateTranslations([
			data.title_translations,
			data.description_translations,
		])
	) {
		await serviceWrapper(
			languagesServices.checks.checkLanguagesExist,
			false,
		)(serviceConfig, {
			language_ids: getUniqueLanguageIDs([
				data.title_translations || [],
				data.description_translations || [],
			]),
		});

		await serviceWrapper(translationsServices.upsertMultiple, false)(
			serviceConfig,
			{
				keys: {
					title: categoryRes.title_translation_key_id,
					description: categoryRes.description_translation_key_id,
				},
				translations: mergeTranslationGroups([
					{
						translations: data.title_translations || [],
						key: "title",
					},
					{
						translations: data.description_translations || [],
						key: "description",
					},
				]),
			},
		);
	}

	const categoryUpdateRes = await serviceConfig.db
		.updateTable("headless_collection_categories")
		.set({
			slug: newSlug,
			updated_at: new Date().toISOString(),
		})
		.where("id", "=", data.id)
		.returning("id")
		.executeTakeFirst();

	if (categoryUpdateRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("category"),
			}),
			message: T("update_error_message", {
				name: T("category").toLowerCase(),
			}),
			status: 500,
		});
	}

	return categoryUpdateRes.id;
};

export default updateSingle;
