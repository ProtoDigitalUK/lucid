export interface ServiceData {
	environmentKey: string;
	assignedCollections?: string[];
}

const createMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.assignedCollections) return;

	await serviceConfig.db
		.insertInto("headless_assigned_collections")
		.values(
			data.assignedCollections.map((collection) => ({
				key: collection,
				environment_key: data.environmentKey,
			})),
		)
		.execute();
};

export default createMultiple;
