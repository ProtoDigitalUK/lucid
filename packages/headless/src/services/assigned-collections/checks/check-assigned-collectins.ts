import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";
import { type HeadlessConfigT } from "../../../schemas/config.js";

const checkAssignedCollections = async (
	config: HeadlessConfigT,
	assignedCollections: string[],
) => {
	const collectionInstances = config.collections || [];
	const collectionKeys = collectionInstances.map((c) => c.key);

	const invalidCollections = assignedCollections.filter(
		(c) => !collectionKeys.includes(c),
	);
	if (invalidCollections.length > 0) {
		throw new APIError({
			type: "basic",
			name: T("invalid_collection_keys"),
			message: T("make_sure_all_assigned_collections_are_valid"),
			status: 400,
			errors: modelErrors({
				assigned_collections: {
					code: "invalid",
					message: T("make_sure_all_assigned_collections_are_valid"),
					children: invalidCollections.map((c) => ({
						code: "invalid",
						message: T("collection_with_key_not_found", {
							key: c,
						}),
					})),
				},
			}),
		});
	}
};

export default checkAssignedCollections;
