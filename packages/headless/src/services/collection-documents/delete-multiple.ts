import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import collectionDocumentsServices from "./index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	ids: number[];
	collectionKey: string;
	userId: number;
}

const deleteMultiple = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	if (data.ids.length === 0) return;

	const collectionInstance =
		await collectionDocumentsServices.checks.checkCollection({
			key: data.collectionKey,
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
				value: data.collectionKey,
			},
			{
				key: "is_deleted",
				operator: "=",
				value: 0,
			},
		],
	});

	if (getDocuments.length !== data.ids.length) {
		throw new HeadlessAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("document"),
			}),
			message: T("error_not_found_message", {
				name: T("document"),
			}),
			errorResponse: {
				body: {
					ids: {
						code: "only_found",
						message: T("only_found_ids_error_message", {
							ids: getDocuments.map((doc) => doc.id).join(", "),
						}),
					},
				},
			},
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
				collectionKey: data.collectionKey,
				userId: data.userId,
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
			deletedBy: data.userId,
		},
	});

	if (deletePages.length === 0) {
		throw new HeadlessAPIError({
			type: "basic",
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
				collectionKey: data.collectionKey,
				userId: data.userId,
			},
			data: {
				ids: deletePages.map((page) => page.id),
			},
		},
	);
};

export default deleteMultiple;
