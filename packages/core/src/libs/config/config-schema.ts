import z from "zod";

const KeySchema = z
	.string()
	.length(64, "Encryption key must be exactly 64 hexadecimal characters long")
	.regex(
		/^[a-fA-F0-9]+$/,
		"Encryption key must contain only hexadecimal characters (0-9 and a-f)",
	);

const ConfigSchema = z.object({
	db: z.unknown(),
	host: z.string(),
	keys: z.object({
		encryptionKey: KeySchema,
		cookieSecret: KeySchema,
		accessTokenSecret: KeySchema,
		refreshTokenSecret: KeySchema,
	}),
	paths: z
		.object({
			emailTemplates: z.string().optional(),
		})
		.optional(),
	disableSwagger: z.boolean(),
	localisation: z
		.object({
			locales: z.array(
				z.object({
					label: z.string(),
					code: z.string(),
				}),
			),
			defaultLocale: z.string(),
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
	hooks: z.array(
		z.object({
			service: z.string(),
			event: z.string(),
			handler: z.unknown(),
		}),
	),
	collections: z.array(z.unknown()),
	plugins: z.array(z.unknown()),
});

export default ConfigSchema;
