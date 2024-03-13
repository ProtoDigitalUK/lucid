export interface ServiceData {
	page_id: number;
	category_ids: Array<number>;
}

const upsertMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.category_ids.length === 0) {
		return;
	}

	const categories = await serviceConfig.db
		.insertInto("headless_collection_multiple_page_categories")
		.values(
			data.category_ids.map((category_id) => ({
				collection_multiple_page_id: data.page_id,
				category_id: category_id,
			})),
		)
		.onConflict((oc) =>
			oc
				.columns(["category_id", "collection_multiple_page_id"])
				.doNothing(),
		)
		.returning("category_id")
		.execute();

	if (categories.length === 0) return;

	await serviceConfig.db
		.deleteFrom("headless_collection_multiple_page_categories")
		.where("collection_multiple_page_id", "=", data.page_id)
		.where("category_id", "not in", data.category_ids)
		.execute();
};

export default upsertMultiple;
