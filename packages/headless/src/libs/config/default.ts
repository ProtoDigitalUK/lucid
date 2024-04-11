import type { Config } from "../../types/config.js";

export const defaultConfig: Partial<Config> = {
	mode: "development", // swap to process.env.NODE_ENV
	db: undefined,
	host: undefined,
	keys: undefined,
	paths: {
		emailTemplates: "./templates",
	},
	email: undefined,
	// media: {
	// 	storage: 5368709120,
	// 	maxSize: 16777216,
	// 	processed: {
	// 		limit: 10,
	// 		store: false,
	// 	},
	// 	fallbackImage: undefined,
	// 	stategy: undefined,
	// },
	collections: [],
	plugins: [],
};

export default defaultConfig;
