import { assignedBricks } from "../../db/schema.js";

export interface ServiceData {
	environmentKey: string;
	assignedBricks?: string[];
}

const createMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.assignedBricks) return;

	await serviceConfig.db.insert(assignedBricks).values(
		data.assignedBricks.map((brick) => ({
			key: brick,
			environment_key: data.environmentKey,
		})),
	);
};

export default createMultiple;
