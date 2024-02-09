import { EnvironmentResT } from "@headless/types/src/environments.js";

const formatEnvironment = (environment: {
	key: string;
	title: string | null;
	assigned_bricks: {
		id: number;
		key: string;
		environment_key: string | null;
	}[];
	assigned_collections: {
		id: number;
		key: string;
		environment_key: string | null;
	}[];
}): EnvironmentResT => {
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
