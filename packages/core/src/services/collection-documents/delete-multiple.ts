import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import executeHooks from "../../utils/hooks/execute-hooks.js";
import type { ServiceFn } from "../../utils/services/types.js";

const deleteMultiple: ServiceFn<
	[
		{
			ids: number[];
			collectionKey: string;
			userId: number;
		},
	],
	undefined
> = async (context, data) => {
	if (data.ids.length === 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

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
		return {
			error: {
				type: "basic",
				message: T("document_not_found_message"),
				errorResponse: {
					body: {
						ids: {
							code: "only_found",
							message: T("only_found_ids_error_message", {
								ids: getDocuments
									.map((doc) => doc.id)
									.join(", "),
							}),
						},
					},
				},
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
				ids: deletePages.map((page) => page.id),
			},
		},
	);

	return {
		error: undefined,
		data: undefined,
	};
};

export default deleteMultiple;
