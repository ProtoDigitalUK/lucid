import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "../collection-bricks/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import multiplePageServices from "./index.js";
import languagesServices from "../languages/index.js";
import translationsServices from "../translations/index.js";
import multiplePageCategoriesServices from "../multiple-page-categories/index.js";
import { getUniqueLanguageIDs } from "../../utils/translations/helpers.js";

export interface ServiceData {
	id: number;
	slug?: string;
	homepage?: boolean;
	published?: boolean;
	parent_id?: number;
	category_ids?: number[];
	title_translations?: {
		language_id: number;
		value: string | null;
	}[];
	excerpt_translations?: {
		language_id: number;
		value: string | null;
	}[];
	bricks?: Array<BrickObjectT>;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// ---------------------------------------
	// Data
	const page = await serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.select([
			"id",
			"collection_key",
			"title_translation_key_id",
			"excerpt_translation_key_id",
			"homepage",
		])
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (page === undefined || page.collection_key === null) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("page"),
			}),
			message: T("error_not_found_message", {
				name: T("page"),
			}),
			status: 404,
		});
	}

	const homepage =
		(data.homepage === undefined ? page.homepage : data.homepage) ?? false;

	// ---------------------------------------
	// Checks
	const [parentId, slug] = await Promise.all([
		serviceWrapper(multiplePageServices.checks.checkParent, false)(
			serviceConfig,
			{
				current_id: data.id,
				collection_key: page.collection_key,
				parent_id: data.parent_id,
				homepage: homepage,
			},
		),
		// TODO: add check parent ancestory
		serviceWrapper(multiplePageServices.checks.checkSlugIsUnique, false)(
			serviceConfig,
			{
				collection_key: page.collection_key,
				slug: data.slug,
				homepage: homepage,
			},
		),
		serviceWrapper(multiplePageServices.checks.checkCollection, false)(
			serviceConfig,
			{
				collection_key: page.collection_key,
				homepage: homepage,
				parent_id: data.parent_id,
			},
		),
		serviceWrapper(
			multiplePageCategoriesServices.checks.checkCategoriesInCollection,
			false,
		)(serviceConfig, {
			category_ids: data.category_ids || [],
			collection_key: page.collection_key,
		}),
	]);

	// ---------------------------------------
	// Updates
	await Promise.all([
		serviceWrapper(translationsServices.upsertMultiple, false)(
			serviceConfig,
			{
				keys: {
					title: page.title_translation_key_id,
					excerpt: page.excerpt_translation_key_id,
				},
				items: [
					{
						translations: data.title_translations || [],
						key: "title",
					},
					{
						translations: data.excerpt_translations || [],
						key: "excerpt",
					},
				],
			},
		),
		serviceWrapper(collectionBricksServices.upsertMultiple, false)(
			serviceConfig,
			{
				id: data.id,
				type: "multiple-page",
				bricks: data.bricks || [],
				collection_key: page.collection_key,
			},
		),
	]);
};

export default updateSingle;
