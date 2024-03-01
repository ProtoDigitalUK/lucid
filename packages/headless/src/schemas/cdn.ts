import z from "zod";

export default {
	streamSingle: {
		body: undefined,
		query: z.object({
			width: z.string().optional(),
			height: z.string().optional(),
			format: z.enum(["jpeg", "png", "webp", "avif"]).optional(),
			quality: z.string().optional(),
			fallback: z.enum(["1", "0"]).optional(),
		}),
		params: z.object({
			key: z.string(),
		}),
	},
};
