import z from "zod";

const CustomFieldSchema = z.object({
	type: z.string(),
	key: z.string(),
	labels: z
		.object({
			title: z
				.union([z.string(), z.record(z.string(), z.string())])
				.optional(),
			description: z
				.union([z.string(), z.record(z.string(), z.string())])
				.optional(),
			placeholder: z
				.union([z.string(), z.record(z.string(), z.string())])
				.optional(),
		})
		.optional(),
	default: z
		.union([
			z.boolean(),
			z.string(),
			z.number(),
			z.undefined(),
			z.object({}),
			z.null(),
		])
		.optional(),
	options: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	presets: z.array(z.string()).optional(),
	validation: z
		.object({
			zod: z.any().optional(),
			required: z.boolean().optional(),
			extensions: z.array(z.string()).optional(),
			width: z
				.object({
					min: z.number().optional(),
					max: z.number().optional(),
				})
				.optional(),
			height: z
				.object({
					min: z.number().optional(),
					max: z.number().optional(),
				})
				.optional(),
		})
		.optional(),
});

export default CustomFieldSchema;
