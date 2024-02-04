import formatEnvironment from "../../format/format-environment.js";

// export interface ServiceData {}

const getAll = async (serviceConfig: ServiceConfigT) => {
	const environmentsRes = await serviceConfig.db.query.environments.findMany({
		with: {
			assigned_bricks: true,
			assigned_collections: true,
		},
	});

	return environmentsRes.map((environment) => formatEnvironment(environment));
};

export default getAll;
