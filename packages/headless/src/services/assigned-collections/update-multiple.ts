import { assignedCollections } from "../../db/schema.js";
import { eq } from "drizzle-orm";

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
		.delete(assignedCollections)
		.where(eq(assignedCollections.environment_key, data.environmentKey));

	await serviceConfig.db.insert(assignedCollections).values(
		data.assignedCollections.map((collection) => ({
			key: collection,
			environment_key: data.environmentKey,
		})),
	);
};

export default updateMultiple;
