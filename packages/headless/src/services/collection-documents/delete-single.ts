import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import collectionDocumentsServices from "./index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";

export interface ServiceData {
	id: number;
	collection_key: string;
	user_id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
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

	const getDocument = await CollectionDocumentsRepo.selectSingle({
		select: ["id"],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
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

	if (getDocument === undefined) {
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
				ids: [data.id],
			},
		},
	);

	const deletePage = await CollectionDocumentsRepo.updateSingle({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
		data: {
			isDeleted: 1,
			isDeletedAt: new Date().toISOString(),
			deletedBy: data.user_id,
		},
	});

	if (deletePage === undefined) {
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
				ids: [data.id],
			},
		},
	);
};

export default deleteSingle;
