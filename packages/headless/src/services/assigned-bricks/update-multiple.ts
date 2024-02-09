export interface ServiceData {
	environmentKey: string;
	assignedBricks?: string[];
}

const updateMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.assignedBricks) return;

	await serviceConfig.db
		.deleteFrom("headless_assigned_bricks")
		.where("environment_key", "=", data.environmentKey)
		.execute();

	await serviceConfig.db
		.insertInto("headless_assigned_bricks")
		.values(
			data.assignedBricks.map((brick) => ({
				key: brick,
				environment_key: data.environmentKey,
			})),
		)
		.execute();
};

export default updateMultiple;
