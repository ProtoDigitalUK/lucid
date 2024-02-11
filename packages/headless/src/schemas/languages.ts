import z from "zod";

export default {
	createSingle: {
		body: z.object({
			code: z.string().min(2), // ISO 639-1 - bcp47
			is_default: z.boolean(),
			is_enabled: z.boolean(),
		}),
		query: undefined,
		params: undefined,
	},
	getSingle: {
		query: undefined,
		params: z.object({
			code: z.string().min(2), // ISO 639-1 - bcp47
		}),
		body: undefined,
	},
	getMultiple: {
		query: z.object({
			sort: z
				.array(
					z.object({
						key: z.enum(["created_at", "code", "updated_at"]),
						value: z.enum(["asc", "desc"]),
					}),
				)
				.optional(),
			page: z.string().optional(),
			per_page: z.string().optional(),
		}),
		params: undefined,
		body: undefined,
	},
	updateSingle: {
		body: z.object({
			code: z.string().min(2).optional(), // ISO 639-1 - bcp47
			is_default: z.boolean().optional(),
			is_enabled: z.boolean().optional(),
		}),
		query: undefined,
		params: z.object({
			code: z.string().min(2), // ISO 639-1 - bcp47
		}),
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			code: z.string().min(2), // ISO 639-1 - bcp47
		}),
	},
};
