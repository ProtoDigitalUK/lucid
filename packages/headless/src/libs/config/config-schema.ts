import z from "zod";
import type { BrickBuilderT } from "../brick-builder-new/index.js";
import type { CollectionBuilderT } from "../collection-builder/index.js";

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
	collections: z.array(z.unknown()).optional(),
	bricks: z.array(z.unknown()).optional(),
});

export interface Config extends z.infer<typeof ConfigSchema> {
	bricks?: BrickBuilderT[];
	collections?: CollectionBuilderT[];
}

export default ConfigSchema;
