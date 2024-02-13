import z from "zod";
import { type CollectionBuilderT } from "../builders/collection-builder/index.js";
import { type BrickBuilderT } from "../builders/brick-builder/index.js";
import type { SendEmailT } from "../services/email/send-email.js";

export const headlessConfigSchema = z.object({
	databaseURL: z.string(),
	host: z.string(),
	mode: z.literal("production").or(z.literal("development")),
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
	sendEmail: z.any(),
	// collections: z.array(z.any()),
	// bricks: z.array(z.any()),
});

export interface HeadlessConfigT extends z.infer<typeof headlessConfigSchema> {
	collections?: CollectionBuilderT[];
	bricks?: BrickBuilderT[];
	sendEmail: SendEmailT;
}
