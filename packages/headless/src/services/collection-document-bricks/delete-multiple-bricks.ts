export interface ServiceData {
	document_id: number;
	bricks: {
		id: number;
		brick_key: string;
		brick_order: number;
	}[];
}

const deleteMultipleBricks = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	await serviceConfig.db
		.deleteFrom("headless_collection_document_bricks")
		.where(
			"id",
			"not in",
			data.bricks.map((brick) => brick.id),
		)
		.where("collection_document_id", "=", data.document_id)
		.execute();
};

export default deleteMultipleBricks;
