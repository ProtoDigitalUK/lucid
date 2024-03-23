import z from "zod";
import type { CollectionBuilderT } from "../collection-builder/index.js";
import constants from "../../constants.js";

const ConfigSchema = z.object({
	mode: z.literal("production").or(z.literal("development")),
	databaseUrl: z.string(),
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
	// TODO: REMOVE THIS IN FAVOUR OF HOOKS/PLUGINS
	email: z.object({
		from: z.object({
			email: z.string(),
			name: z.string(),
		}),
		strategy: z.any(),
	}),
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
});

export type EmailStrategyT = (
	email: {
		to: string;
		subject: string;
		from: {
			email: string;
			name: string;
		};
		html: string;
		text?: string;
		cc?: string;
		bcc?: string;
		replyTo?: string;
	},
	meta: {
		data: {
			[key: string]: unknown;
		};
		template: string;
		hash: string;
	},
) => Promise<{
	success: boolean;
	message: string;
}>;

export interface Config extends z.infer<typeof ConfigSchema> {
	collections?: CollectionBuilderT[];
	email: {
		from: {
			email: string;
			name: string;
		};
		strategy: EmailStrategyT;
	};
}

export default ConfigSchema;
