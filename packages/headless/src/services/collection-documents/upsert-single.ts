import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import collectionDocumentsServices from "./index.js";
import collectionDocumentCategoriesServices from "../collection-document-categories/index.js";
import collectionDocumentBricksServices from "../collection-document-bricks/index.js";
import type { BrickSchemaT } from "../../schemas/collection-bricks.js";
import type { FieldCollectionSchemaT } from "../../schemas/collection-fields.js";
import type { BooleanInt } from "../../libs/db/types.js";
import { upsertErrorContent } from "../../utils/helpers.js";

export interface ServiceData {
	collection_key: string;
	user_id: number;

	document_id?: number;

	slug?: string;
	homepage?: BooleanInt;
	parent_id?: number | null;
	category_ids?: number[];
	bricks?: Array<BrickSchemaT>;
	fields?: Array<FieldCollectionSchemaT>;
}

const upsertSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const errorContent = upsertErrorContent(
		data.document_id === undefined,
		T("document"),
	);

	if (data.document_id !== undefined) {
		const existingDocument = await serviceConfig.db
			.selectFrom("headless_collection_documents")
			.select("id")
			.where("id", "=", data.document_id)
			.where("collection_key", "=", data.collection_key)
			.executeTakeFirst();

		if (existingDocument === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_found_name", {
					name: T("document"),
				}),
				message: T("error_not_found_message", {
					name: T("document"),
				}),
				status: 404,
			});
		}
	}

	/*
        Check:
        - Collection config
        - Collection existence
    */
	const collectionInstance =
		await collectionDocumentsServices.checks.checkCollection({
			key: data.collection_key,
			has_slug: data.slug !== undefined,
			has_homepage: data.homepage !== undefined,
			has_parent_id:
				data.parent_id !== undefined && data.parent_id !== null,
			has_category_ids: data.category_ids !== undefined,
			errorContent: errorContent,
		});

	const bodyDataEnabled = {
		slug: collectionInstance.data.config.enableSlugs
			? data.slug
			: undefined,
		homepage: collectionInstance.data.config.enableHomepages
			? data.homepage
			: undefined,
		parent_id: collectionInstance.data.config.enableParents
			? data.parent_id
			: undefined,
		category_ids: collectionInstance.data.config.enableCategories
			? data.category_ids
			: undefined,
	};

	/*
        Check:
        - Parent
        - Slug
        - Single collection document count
        - Categories
        - Parent ancestry
    */
	const [parentId, slug] = await Promise.all([
		serviceWrapper(collectionDocumentsServices.checks.checkParent, false)(
			serviceConfig,
			{
				collection_key: data.collection_key,
				parent_id: bodyDataEnabled.parent_id,
				homepage: bodyDataEnabled.homepage,
				errorContent: errorContent,
			},
		),
		serviceWrapper(
			collectionDocumentsServices.checks.checkSlugIsUnique,
			false,
		)(serviceConfig, {
			collection_key: data.collection_key,
			slug: bodyDataEnabled.slug,
			document_id: data.document_id,
			errorContent: errorContent,
		}),
		serviceWrapper(
			collectionDocumentsServices.checks
				.checkSingleCollectionDocumentCount,
			false,
		)(serviceConfig, {
			collection_key: data.collection_key,
			collection_mode: collectionInstance.data.mode,
			document_id: data.document_id,
			errorContent: errorContent,
		}),
		serviceWrapper(
			collectionDocumentsServices.checks.checkCategoriesInCollection,
			false,
		)(serviceConfig, {
			collection_key: data.collection_key,
			category_ids: bodyDataEnabled.category_ids,
			errorContent: errorContent,
		}),
		serviceWrapper(
			collectionDocumentsServices.checks.checkParentAncestry,
			false,
		)(serviceConfig, {
			document_id: data.document_id,
			parent_id: bodyDataEnabled.parent_id,
			errorContent: errorContent,
		}),
	]);

	console.log("checks done");

	/*
        Insert:
        - Document
    */
	const document = await serviceConfig.db
		.insertInto("headless_collection_documents")
		.values({
			id: data.document_id,
			collection_key: data.collection_key,
			author_id: data.user_id,
			created_by: data.user_id,
			slug: slug,
			homepage: bodyDataEnabled.homepage,
			parent_id: parentId,
			updated_by: data.user_id,
		})
		.returning("id")
		.onConflict((oc) =>
			oc.column("id").doUpdateSet({
				author_id: data.user_id,
				created_by: data.user_id,
				slug: slug,
				homepage: bodyDataEnabled.homepage,
				parent_id: parentId,
				updated_by: data.user_id,
			}),
		)
		.executeTakeFirst();

	if (document === undefined) {
		throw new APIError({
			type: "basic",
			name: errorContent.name,
			message: errorContent.message,
			status: 400,
		});
	}

	/*
        Update:
        - Homepages
        - Document categories
        - Upsert Bricks
        - Upsert Collection fields
    */
	await Promise.all([
		bodyDataEnabled.homepage === 1
			? serviceWrapper(collectionDocumentsServices.resetHomepages, false)(
					serviceConfig,
					{
						collection_key: data.collection_key,
						exclude_id: document.id,
						document_id: data.document_id,
					},
				)
			: undefined,
		serviceWrapper(
			collectionDocumentCategoriesServices.upsertMultiple,
			false,
		)(serviceConfig, {
			document_id: document.id,
			category_ids: data.category_ids || [],
		}),
		serviceWrapper(collectionDocumentBricksServices.upsertMultiple, false)(
			serviceConfig,
			{
				document_id: document.id,
				bricks: data.bricks,
				fields: data.fields || [],
				collection_key: data.collection_key,
			},
		),
	]);

	return document.id;
};

export default upsertSingle;
