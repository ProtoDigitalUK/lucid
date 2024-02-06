import { EnvironmentResT } from "@headless/types/src/environments.js";
import { type EnvrionmentsWithRelationsT } from "../db/schema.js";

const formatEnvironment = (
	environment: EnvrionmentsWithRelationsT,
): EnvironmentResT => {
	return {
		key: environment.key,
		title: environment.title,
		assigned_bricks: environment.assigned_bricks.map((brick) => brick.key),
		assigned_collections: environment.assigned_collections.map(
			(collection) => collection.key,
		),
	};
};

export const swaggerEnvironmentRes = {
	type: "object",
	properties: {
		key: { type: "string", example: "production" },
		title: { type: "string", example: "Production" },
		assigned_bricks: {
			type: "array",
			example: ["hero-banner", "intro"],
		},
		assigned_collections: {
			type: "array",
			example: ["pages", "articles"],
		},
	},
};

export default formatEnvironment;
