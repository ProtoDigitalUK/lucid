import zod from "zod";

export const headlessConfigSchema = zod.object({
	databaseURL: zod.string(),
	host: zod.string(),
	mode: zod.literal("production").or(zod.literal("development")),
	keys: zod.object({
		cookieSecret: zod.string(),
	}),
	collections: zod.array(zod.string()),
	bricks: zod.array(zod.string()),
});

export type HeadlessConfigT = zod.infer<typeof headlessConfigSchema>;
