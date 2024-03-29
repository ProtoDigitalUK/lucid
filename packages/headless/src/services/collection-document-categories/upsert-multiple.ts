export interface ServiceData {
	document_id: number;
	category_ids: Array<number>;
}

const upsertMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.category_ids.length === 0) {
		return;
	}

	const categories = await serviceConfig.config.db.client
		.insertInto("headless_collection_document_categories")
		.values(
			data.category_ids.map((category_id) => ({
				collection_document_id: data.document_id,
				category_id: category_id,
			})),
		)
		.onConflict((oc) =>
			oc.columns(["category_id", "collection_document_id"]).doNothing(),
		)
		.returning("category_id")
		.execute();

	if (categories.length === 0) return;

	await serviceConfig.config.db.client
		.deleteFrom("headless_collection_document_categories")
		.where("collection_document_id", "=", data.document_id)
		.where("category_id", "not in", data.category_ids)
		.execute();
};

export default upsertMultiple;
