export interface ServiceData {
	document_id: number;
	category_ids: Array<number>;
}

const createMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.category_ids.length === 0) {
		return;
	}

	await serviceConfig.db
		.insertInto("headless_collection_multiple_builder_categories")
		.values(
			data.category_ids.map((category_id) => ({
				collection_multiple_builder_id: data.document_id,
				category_id: category_id,
			})),
		)
		.execute();
};

export default createMultiple;
