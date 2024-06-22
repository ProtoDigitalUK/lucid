import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import executeHooks from "../../utils/hooks/execute-hooks.js";
import type { ServiceFn } from "../../utils/services/types.js";

const deleteSingle: ServiceFn<
	[
		{
			id: number;
			collectionKey: string;
			userId: number;
		},
	],
	undefined
> = async (context, data) => {
	const collectionRes =
		await context.services.collection.document.checks.checkCollection(
			context,
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
				message: T("error_locked_collection_message_delete"),
				status: 400,
			},
			data: undefined,
		};
	}

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		context.db,
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
				message: T("document_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	await executeHooks(
		{
			service: "collection-documents",
			event: "beforeDelete",
			config: context.config,
			collectionInstance: collectionRes.data,
		},
		{
			db: context.db,
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
			config: context.config,
			collectionInstance: collectionRes.data,
		},
		{
			db: context.db,
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
