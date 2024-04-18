import type { HeadlessConfig } from "../../types/config.js";

export const defaultConfig: Partial<HeadlessConfig> = {
	mode: "development",
	paths: {
		emailTemplates: "./templates",
	},
	email: undefined,
	media: {
		storage: 5368709120,
		maxSize: 16777216,
		processed: {
			limit: 10,
			store: false,
		},
		fallbackImage: undefined,
		stategy: undefined,
	},
	hooks: [],
	collections: [],
	plugins: [],
};

export default defaultConfig;
