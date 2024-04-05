import z from "zod";

import constants from "../../constants.js";

const ConfigSchema = z.object({
	mode: z.literal("production").or(z.literal("development")),
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
			strategy: z.any(),
		})
		.optional(),
	// TODO: REMOVE THIS IN FAVOUR OF HOOKS/PLUGINS
	media: z.object({
		storageLimit: z
			.number()
			.default(constants.media.storageLimit)
			.optional(),
		maxFileSize: z.number().default(constants.media.maxFileSize).optional(),
		processedImages: z
			.object({
				limit: z
					.number()
					.default(constants.media.processedImages.limit)
					.optional(),
				store: z
					.boolean()
					.default(constants.media.processedImages.store)
					.optional(),
			})
			.optional(),
		fallbackImage: z.union([z.string(), z.boolean()]).optional(),
		store: z.object({
			service: z.enum(["aws", "cloudflare"]),
			cloudflareAccountId: z.string().optional(),
			region: z.string(),
			bucket: z.string(),
			accessKeyId: z.string(),
			secretAccessKey: z.string(),
		}),
	}),
	collections: z.array(z.unknown()).optional(),
	plugins: z.array(z.unknown()).optional(),
});

export default ConfigSchema;
