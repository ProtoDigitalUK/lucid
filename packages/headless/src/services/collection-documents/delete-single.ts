import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import collectionDocumentsServices from "./index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	id: number;
	collectionKey: string;
	userId: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const collectionInstance =
		await collectionDocumentsServices.checks.checkCollection({
			key: data.collectionKey,
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
				value: data.collectionKey,
			},
			{
				key: "is_deleted",
				operator: "=",
				value: 0,
			},
		],
	});

	if (getDocument === undefined) {
		throw new HeadlessAPIError({
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
				collectionKey: data.collectionKey,
				userId: data.userId,
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
			deletedBy: data.userId,
		},
	});

	if (deletePage === undefined) {
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
				ids: [data.id],
			},
		},
	);
};

export default deleteSingle;
