import z from "zod";
import { BrickSchema } from "./bricks.js";

export default {
	getSingle: {
		query: undefined,
		params: z.object({
			collection_key: z.string(),
		}),
		body: undefined,
	},
	updateSingle: {
		body: z.object({
			bricks: z.array(BrickSchema),
		}),
		query: undefined,
		params: z.object({
			collection_key: z.string(),
		}),
	},
};
