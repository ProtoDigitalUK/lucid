import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "../collection-bricks/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import multiplePageServices from "./index.js";
import translationsServices from "../translations/index.js";
import multiplePageCategoriesServices from "../multiple-page-categories/index.js";

export interface ServiceData {
	id: number;
	slug?: string;
	homepage?: boolean;
	published?: boolean;
	parent_id?: number | null;
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
	user_id?: number;
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
	if (
		page.homepage === true &&
		homepage === false &&
		data.slug === undefined
	) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("page"),
			}),
			message: T("update_error_message", {
				name: T("page").toLowerCase(),
			}),
			status: 400,
			errors: modelErrors({
				slug: {
					code: "required",
					message: T(
						"page_slug_required_if_setting_homepage_to_false",
					),
				},
			}),
		});
	}

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
		serviceWrapper(multiplePageServices.checks.checkSlugIsUnique, false)(
			serviceConfig,
			{
				collection_key: page.collection_key,
				slug: data.slug,
				homepage: homepage,
				page_id: data.id,
			},
		),
		serviceWrapper(multiplePageServices.checks.checkParentAncestry, false)(
			serviceConfig,
			{
				page_id: data.id,
				parent_id: data.parent_id,
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
	const [pageRes] = await Promise.all([
		serviceConfig.db
			.updateTable("headless_collection_multiple_page")
			.set({
				slug: slug,
				homepage: homepage,
				published: data.published,
				parent_id: parentId,
				updated_at: new Date(),
				published_at: data.published ? new Date() : undefined,
				updated_by: data.user_id,
			})
			.where("id", "=", data.id)
			.returning("id")
			.executeTakeFirst(),
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
		serviceWrapper(multiplePageCategoriesServices.upsertMultiple, false)(
			serviceConfig,
			{
				page_id: data.id,
				category_ids: data.category_ids || [],
			},
		),
		homepage === true
			? serviceWrapper(multiplePageServices.resetHomepages, false)(
					serviceConfig,
					{
						collection_key: page.collection_key,
						exclude_id: data.id,
						page_id: data.id,
					},
			  )
			: undefined,
	]);

	if (pageRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("page"),
			}),
			message: T("update_error_message", {
				name: T("page").toLowerCase(),
			}),
			status: 500,
		});
	}

	return pageRes.id;
};

export default updateSingle;
