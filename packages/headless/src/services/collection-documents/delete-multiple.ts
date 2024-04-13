import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import collectionDocumentsServices from "./index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";

export interface ServiceData {
	ids: number[];
	collection_key: string;
	user_id: number;
}

const deleteMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.ids.length === 0) return;

	const collectionInstance =
		await collectionDocumentsServices.checks.checkCollection({
			key: data.collection_key,
			errorContent: {
				name: T("error_not_found_name", {
					name: T("collection"),
				}),
				message: T("collection_not_found_message"),
			},
		});

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	const getDocuments = await CollectionDocumentsRepo.selectMultiple({
		select: ["id"],
		where: [
			{
				key: "id",
				operator: "in",
				value: data.ids,
			},
			{
				key: "collection_key",
				operator: "=",
				value: data.collection_key,
			},
			{
				key: "is_deleted",
				operator: "=",
				value: 0,
			},
		],
	});

	if (getDocuments.length !== data.ids.length) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("document"),
			}),
			message: T("error_not_found_message", {
				name: T("document"),
			}),
			errors: modelErrors({
				ids: {
					code: "only_found",
					message: T("only_found_ids_error_message", {
						ids: getDocuments.map((doc) => doc.id).join(", "),
					}),
				},
			}),
			status: 404,
		});
	}

	await executeHooks(
		{
			service: "collection-documents",
			event: "beforeDelete",
			config: serviceConfig.config,
			collectionInstance: collectionInstance,
		},
		{
			meta: {
				collection_key: data.collection_key,
				user_id: data.user_id,
			},
			data: {
				ids: data.ids,
			},
		},
	);

	const deletePages = await CollectionDocumentsRepo.updateMultiple({
		where: [
			{
				key: "id",
				operator: "in",
				value: data.ids,
			},
		],
		data: {
			isDeleted: 1,
			isDeletedAt: new Date().toISOString(),
			deletedBy: data.user_id,
		},
	});

	if (deletePages.length === 0) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("document"),
			}),
			message: T("deletion_error_message", {
				name: T("document").toLowerCase(),
			}),
			status: 500,
		});
	}

	await executeHooks(
		{
			service: "collection-documents",
			event: "afterDelete",
			config: serviceConfig.config,
			collectionInstance: collectionInstance,
		},
		{
			meta: {
				collection_key: data.collection_key,
				user_id: data.user_id,
			},
			data: {
				ids: deletePages.map((page) => page.id),
			},
		},
	);
};

export default deleteMultiple;
