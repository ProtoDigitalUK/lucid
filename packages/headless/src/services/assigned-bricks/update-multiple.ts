import { assignedBricks } from "../../db/schema.js";
import { eq } from "drizzle-orm";

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
		.delete(assignedBricks)
		.where(eq(assignedBricks.environment_key, data.environmentKey));

	await serviceConfig.db.insert(assignedBricks).values(
		data.assignedBricks.map((brick) => ({
			key: brick,
			environment_key: data.environmentKey,
		})),
	);
};

export default updateMultiple;
