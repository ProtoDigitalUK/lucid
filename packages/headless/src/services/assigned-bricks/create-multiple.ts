export interface ServiceData {
	environmentKey: string;
	assignedBricks?: string[];
}

const createMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.assignedBricks) return;

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

export default createMultiple;
