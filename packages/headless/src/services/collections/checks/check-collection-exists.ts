export interface ServiceData {
	key: string;
}

const checkCollectionExists = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const collectionExists = await serviceConfig.db
		.selectFrom("headless_collections")
		.select("key")
		.where("key", "=", data.key)
		.executeTakeFirst();

	return collectionExists !== undefined;
};

export default checkCollectionExists;
