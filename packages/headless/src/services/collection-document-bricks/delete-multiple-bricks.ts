import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	documentId: number;
	bricks: {
		id: number;
		brick_key: string | null;
		brick_order: number | null;
		brick_type: string;
	}[];
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

	// get all ids based on brick type
	const collectionFieldsBricksIds = data.bricks
		.filter((brick) => brick.brick_type === "collection-fields")
		.map((brick) => brick.id);

	const builderBricksIds = data.bricks
		.filter((brick) => brick.brick_type !== "collection-fields")
		.map((brick) => brick.id);

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
				{
					key: "id",
					operator: "not in",
					value: collectionFieldsBricksIds,
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
				{
					key: "id",
					operator: "not in",
					value: builderBricksIds,
				},
			],
		});
	}
};

export default deleteMultipleBricks;
