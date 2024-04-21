import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	documentId: number;
	apply: {
		bricks: boolean;
		collectionFields: boolean;
	};
}

const deleteMultipleBricks = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const CollectionDocumentBricksRepo = Repository.get(
		"collection-document-bricks",
		serviceConfig.db,
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
};

export default deleteMultipleBricks;
