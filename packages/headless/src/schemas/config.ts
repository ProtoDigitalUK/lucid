import z from "zod";
import { type Transporter } from "nodemailer";
import { type CollectionBuilderT } from "../builders/collection-builder/index.js";
import { type BrickBuilderT } from "../builders/brick-builder/index.js";

export const headlessConfigSchema = z.object({
	databaseURL: z.string(),
	host: z.string(),
	mode: z.literal("production").or(z.literal("development")),
	keys: z.object({
		cookieSecret: z.string(),
		accessTokenSecret: z.string(),
		refreshTokenSecret: z.string(),
	}),
	email: z.object({
		from: z.object({
			name: z.string(),
			email: z.string().email(),
		}),
		templateDir: z.string().optional(),
		transporter: z.any(),
	}),
	// collections: z.array(z.any()),
	// bricks: z.array(z.any()),
});

export interface HeadlessConfigT extends z.infer<typeof headlessConfigSchema> {
	collections?: CollectionBuilderT[];
	bricks?: BrickBuilderT[];
	email: {
		from: {
			name: string;
			email: string;
		};
		templateDir?: string;
		transporter: Transporter;
	};
}
