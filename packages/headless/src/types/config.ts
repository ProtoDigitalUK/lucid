import type z from "zod";
import type { CollectionBuilderT } from "../libs/builders/collection-builder/index.js";
import type { DatabaseAdapterT } from "../libs/db/adapter.js";
import type ConfigSchema from "../libs/config/config-schema.js";

export type HeadlessPlugin = (config: Config) => Config;
export type HeadlessPluginOptions<T> = (
	config: Config,
	pluginOptions: T,
) => Config;

export type EmailStrategy = (
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
	db: DatabaseAdapterT;
	collections?: CollectionBuilderT[];
	email?: {
		from: {
			email: string;
			name: string;
		};
		strategy: EmailStrategy;
	};
	plugins?: Array<HeadlessPlugin>;
}
