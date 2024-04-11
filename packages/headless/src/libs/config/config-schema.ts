import z from "zod";

const ConfigSchema = z.object({
	mode: z.union([z.literal("production"), z.literal("development")]),
	db: z.unknown(),
	host: z.string(),
	keys: z.object({
		cookieSecret: z.string(),
		accessTokenSecret: z.string(),
		refreshTokenSecret: z.string(),
	}),
	paths: z
		.object({
			emailTemplates: z.string().optional(),
		})
		.optional(),
	email: z
		.object({
			from: z.object({
				email: z.string(),
				name: z.string(),
			}),
			strategy: z.unknown(),
		})
		.optional(),
	media: z.object({
		storage: z.number(),
		maxSize: z.number(),
		processed: z.object({
			limit: z.number(),
			store: z.boolean(),
		}),
		fallbackImage: z.union([z.string(), z.boolean()]).optional(),
		strategy: z.unknown().optional(),
	}),
	collections: z.array(z.unknown()),
	plugins: z.array(z.unknown()),
});

export default ConfigSchema;
