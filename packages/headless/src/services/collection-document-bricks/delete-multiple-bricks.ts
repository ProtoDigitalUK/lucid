import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	apply: boolean;
	document_id: number;
	bricks: {
		id: number;
		brick_key: string | null;
		brick_order: number | null;
		brick_type: string;
	}[];
}

const deleteMultipleBricks = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.apply) return;

	const ids = data.bricks.map((brick) => brick.id);

	const CollectionDocumentBricksRepo = RepositoryFactory.getRepository(
		"collection-document-bricks",
		serviceConfig.db,
	);

	if (ids.length === 0) {
		await CollectionDocumentBricksRepo.deleteMultiple({
			where: [
				{
					key: "collection_document_id",
					operator: "=",
					value: data.document_id,
				},
				{
					key: "brick_type",
					operator: "!=",
					value: "collection-fields",
				},
			],
		});
		return;
	}

	await CollectionDocumentBricksRepo.deleteMultiple({
		where: [
			{
				key: "id",
				operator: "not in",
				value: data.bricks.map((b) => b.id),
			},
			{
				key: "collection_document_id",
				operator: "=",
				value: data.document_id,
			},
			{
				key: "brick_type",
				operator: "!=",
				value: "collection-fields",
			},
		],
	});
};

export default deleteMultipleBricks;
