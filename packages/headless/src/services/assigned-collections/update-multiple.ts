export interface ServiceData {
	environmentKey: string;
	assignedCollections?: string[];
}

const updateMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.assignedCollections) return;

	await serviceConfig.db
		.deleteFrom("headless_assigned_collections")
		.where("environment_key", "=", data.environmentKey)
		.execute();

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

export default updateMultiple;
