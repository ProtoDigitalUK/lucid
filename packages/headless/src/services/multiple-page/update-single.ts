import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "../collection-bricks/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import translationsServices from "../translations/index.js";
import {
	mergeTranslationGroups,
	shouldUpdateTranslations,
	getUniqueLanguageIDs,
} from "../../utils/translations/helpers.js";

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
	// Check if the page exists
	const page = await serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.select([
			"id",
			"collection_key",
			"title_translation_key_id",
			"excerpt_translation_key_id",
		])
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (page === undefined) {
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

	// Check if the page is a parent of itself
	if (data.parent_id !== undefined && page.id === data.parent_id) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("page"),
			}),
			message: T("update_error_message", {
				name: T("page").toLowerCase(),
			}),
			status: 400,
			errors: modelErrors({
				parent_id: {
					code: "invalid",
					message: T("page_cannot_be_parent_of_itself"),
				},
			}),
		});
	}

	// Update translations
	await serviceWrapper(translationsServices.upsertMultiple, false)(
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
	);

	if (page.collection_key && data.bricks && data.bricks.length > 0) {
		await serviceWrapper(collectionBricksServices.upsertMultiple, false)(
			serviceConfig,
			{
				id: data.id,
				type: "multiple-page",
				bricks: data.bricks,
				collection_key: page.collection_key,
			},
		);
	}
};

export default updateSingle;
