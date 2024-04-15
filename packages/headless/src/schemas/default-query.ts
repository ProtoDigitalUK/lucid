import z from "zod";

/*
z.object({
	filter: z
		.object({
			first_name: z.union([z.string(), z.array(z.string())]).optional(),
			last_name: z.union([z.string(), z.array(z.string())]).optional(),
			email: z.union([z.string(), z.array(z.string())]).optional(),
			username: z.union([z.string(), z.array(z.string())]).optional(),
		})
		.optional(),
	sort: z
		.array(
			z.object({
				key: z.enum(["created_at", "title"]),
				value: z.enum(["asc", "desc"]),
			}),
		)
		.optional(),
	include: defaultQuery.include,
	exclude: defaultQuery.exclude,
	page: defaultQuery.page,
	per_page: defaultQuery.per_page,
})
*/

export default {
	filter: z.object({}).optional(),
	sort: z
		.array(
			z.object({
				key: z.string(),
				value: z.enum(["asc", "desc"]),
			}),
		)
		.optional(),
	include: z.array(z.string()).optional(),
	exclude: z.array(z.string()).optional(),
	page: z.number(),
	perPage: z.number(),
};
