export interface ServiceData {
	slug: string;
	collectionKey: string;
	excludeId?: number;
}

const checkSlugExists = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let slugExistsQuery = serviceConfig.db
		.selectFrom("headless_collection_categories")
		.select("id")
		.where("slug", "=", data.slug)
		.where("collection_key", "=", data.collectionKey);

	if (data.excludeId !== undefined) {
		slugExistsQuery = slugExistsQuery.where("id", "!=", data.excludeId);
	}

	const slugExists = await slugExistsQuery.executeTakeFirst();

	return slugExists !== undefined;
};

export default checkSlugExists;
