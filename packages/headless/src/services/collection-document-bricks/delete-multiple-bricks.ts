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

	if (ids.length === 0) {
		await serviceConfig.db
			.deleteFrom("headless_collection_document_bricks")
			.where("collection_document_id", "=", data.document_id)
			.where("brick_type", "!=", "collection-fields")
			.execute();
		return;
	}

	await serviceConfig.db
		.deleteFrom("headless_collection_document_bricks")
		.where(
			"id",
			"not in",
			data.bricks.map((brick) => brick.id),
		)
		.where("collection_document_id", "=", data.document_id)
		.where("brick_type", "!=", "collection-fields")
		.execute();
};

export default deleteMultipleBricks;
