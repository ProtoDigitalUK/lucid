import type { LucidConfig } from "../../types/config.js";

export const defaultConfig: Partial<LucidConfig> = {
	mode: "development",
	paths: {
		emailTemplates: "./templates",
	},
	email: undefined,
	disableSwagger: false,
	media: {
		storage: 5368709120,
		maxSize: 16777216,
		processed: {
			limit: 10,
			store: false,
		},
		fallbackImage: undefined,
		strategy: undefined,
	},
	hooks: [],
	collections: [],
	plugins: [],
};

export default defaultConfig;
