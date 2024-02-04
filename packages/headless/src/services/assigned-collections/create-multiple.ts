import { assignedCollections } from "../../db/schema.js";

export interface ServiceData {
	environmentKey: string;
	assignedCollections?: string[];
}

const createMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (!data.assignedCollections) return;

	await serviceConfig.db.insert(assignedCollections).values(
		data.assignedCollections.map((collection) => ({
			key: collection,
			environment_key: data.environmentKey,
		})),
	);
};

export default createMultiple;
