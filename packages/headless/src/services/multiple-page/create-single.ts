import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import multiplePageServices from "./index.js";
import languagesServices from "../languages/index.js";
import translationsServices from "../translations/index.js";
import multiplePageCategoriesServices from "../multiple-page-categories/index.js";
import {
	mergeTranslationGroups,
	getUniqueLanguageIDs,
} from "../../utils/translations/helpers.js";

export interface ServiceData {
	collection_key: string;
	user_id: number;
	slug: string;
	homepage?: boolean;
	published?: boolean;
	parent_id?: number;
	category_ids?: number[];
	title_translations: {
		language_id: number;
		value: string | null;
	}[];
	excerpt_translations?: {
		language_id: number;
		value: string | null;
	}[];
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const [parentId, slug] = await Promise.all([
		serviceWrapper(multiplePageServices.checks.checkParent, false)(
			serviceConfig,
			{
				collection_key: data.collection_key,
				parent_id: data.parent_id,
				homepage: data.homepage,
			},
		),
		serviceWrapper(multiplePageServices.checks.checkSlugIsUnique, false)(
			serviceConfig,
			{
				collection_key: data.collection_key,
				slug: data.slug,
				homepage: data.homepage,
			},
		),
		serviceWrapper(multiplePageServices.checks.checkCollection, false)(
			serviceConfig,
			{
				collection_key: data.collection_key,
				homepage: data.homepage,
				parent_id: data.parent_id,
			},
		),
		serviceWrapper(languagesServices.checks.checkLanguagesExist, false)(
			serviceConfig,
			{
				language_ids: getUniqueLanguageIDs([
					data.title_translations,
					data.excerpt_translations || [],
				]),
			},
		),
		serviceWrapper(
			multiplePageCategoriesServices.checks.checkCategoriesInCollection,
			false,
		)(serviceConfig, {
			category_ids: data.category_ids || [],
			collection_key: data.collection_key,
		}),
	]);

	const translationKeys = await serviceWrapper(
		translationsServices.createMultiple,
		false,
	)(serviceConfig, {
		keys: ["title", "excerpt"],
		translations: mergeTranslationGroups([
			{
				translations: data.title_translations,
				key: "title",
			},
			{
				translations: data.excerpt_translations || [],
				key: "excerpt",
			},
		]),
	});

	const document = await serviceConfig.db
		.insertInto("headless_collection_multiple_page")
		.values({
			collection_key: data.collection_key,
			author_id: data.user_id,
			created_by: data.user_id,
			slug: slug,
			homepage: data.homepage,
			published: data.published,
			parent_id: parentId,
			title_translation_key_id: translationKeys.title,
			excerpt_translation_key_id: translationKeys.excerpt,
		})
		.returning("id")
		.executeTakeFirst();

	if (document === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("document"),
			}),
			message: T("error_not_created_message", {
				name: T("document"),
			}),
			status: 500,
		});
	}

	await Promise.all([
		data.homepage &&
			serviceWrapper(multiplePageServices.resetHomepages, false)(
				serviceConfig,
				{
					collection_key: data.collection_key,
					exclude_id: document.id,
				},
			),
		serviceWrapper(multiplePageCategoriesServices.createMultiple, false)(
			serviceConfig,
			{
				document_id: document.id,
				category_ids: data.category_ids || [],
			},
		),
	]);

	return document.id;
};

export default createSingle;
