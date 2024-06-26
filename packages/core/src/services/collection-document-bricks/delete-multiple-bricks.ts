import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const deleteMultipleBricks: ServiceFn<
	[
		{
			documentId: number;
			apply: {
				bricks: boolean;
				collectionFields: boolean;
			};
		},
	],
	undefined
> = async (context, data) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		context.db,
	);

	if (data.apply.collectionFields) {
		await CollectionDocumentBricksRepo.deleteMultiple({
			where: [
				{
					key: "collection_document_id",
					operator: "=",
					value: data.documentId,
				},
				{
					key: "brick_type",
					operator: "=",
					value: "collection-fields",
				},
			],
		});
	}
	if (data.apply.bricks) {
		await CollectionDocumentBricksRepo.deleteMultiple({
			where: [
				{
					key: "collection_document_id",
					operator: "=",
					value: data.documentId,
				},
				{
					key: "brick_type",
					operator: "!=",
					value: "collection-fields",
				},
			],
		});
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default deleteMultipleBricks;
