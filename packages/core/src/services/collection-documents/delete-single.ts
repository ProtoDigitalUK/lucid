import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import LucidServices from "../index.js";
import executeHooks from "../../libs/hooks/execute-hooks.js";
import type { ServiceFn } from "../../libs/services/types.js";

const deleteSingle: ServiceFn<
	[
		{
			id: number;
			collectionKey: string;
			userId: number;
		},
	],
	undefined
> = async (service, data) => {
	const collectionRes =
		await LucidServices.collection.document.checks.checkCollection(
			service,
			{
				key: data.collectionKey,
			},
		);
	if (collectionRes.error) return collectionRes;

	if (collectionRes.data.config.locked === true) {
		return {
			error: {
				type: "basic",
				name: T("error_locked_collection_name"),
				message: T("error_locked_collection_message_delete", {
					name: collectionRes.data.data.title,
				}),
				status: 400,
			},
			data: undefined,
		};
	}

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		service.db,
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
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("document"),
				}),
				message: T("error_not_found_message", {
					name: T("document"),
				}),
				status: 404,
			},
			data: undefined,
		};
	}

	await executeHooks(
		{
			service: "collection-documents",
			event: "beforeDelete",
			config: service.config,
			collectionInstance: collectionRes.data,
		},
		{
			db: service.db,
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
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	await executeHooks(
		{
			service: "collection-documents",
			event: "afterDelete",
			config: service.config,
			collectionInstance: collectionRes.data,
		},
		{
			db: service.db,
			meta: {
				collectionKey: data.collectionKey,
				userId: data.userId,
			},
			data: {
				ids: [data.id],
			},
		},
	);

	return {
		error: undefined,
		data: undefined,
	};
};

export default deleteSingle;
