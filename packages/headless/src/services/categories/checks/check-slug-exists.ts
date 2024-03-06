export interface ServiceData {
	slug: string;
	collectionKey: string;
}

const checkSlugExists = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const slugExists = await serviceConfig.db
		.selectFrom("headless_collection_categories")
		.select("id")
		.where("slug", "=", data.slug)
		.where("collection_key", "=", data.collectionKey)
		.executeTakeFirst();

	return slugExists !== undefined;
};

export default checkSlugExists;
