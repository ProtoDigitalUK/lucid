export interface ServiceData {
	slug: string;
	collection_key: string;
	exclude_id?: number;
}

const checkSlugExists = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let slugExistsQuery = serviceConfig.config.db.client
		.selectFrom("headless_collection_categories")
		.select("id")
		.where("slug", "=", data.slug)
		.where("collection_key", "=", data.collection_key);

	if (data.exclude_id !== undefined) {
		slugExistsQuery = slugExistsQuery.where("id", "!=", data.exclude_id);
	}

	const slugExists = await slugExistsQuery.executeTakeFirst();

	return slugExists !== undefined;
};

export default checkSlugExists;
