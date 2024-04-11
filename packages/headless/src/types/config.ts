import type z from "zod";
import type { CollectionBuilderT } from "../libs/builders/collection-builder/index.js";
import type { DatabaseAdapterT } from "../libs/db/adapter.js";
import type ConfigSchema from "../libs/config/config-schema.js";
import type { Readable } from "node:stream";
import type { MediaMetaDataT } from "../utils/media-helpers.js";

export type HeadlessPlugin = (config: Config) => Promise<Config>;
export type HeadlessPluginOptions<T> = (
	config: Config,
	pluginOptions: T,
) => Promise<Config>;

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

export type MediaStrategyStream = (key: string) => Promise<{
	success: boolean;
	message: string;
	response: {
		contentLength: number | undefined;
		contentType: string | undefined;
		body: Readable;
	} | null;
}>;
export type MediaStrategyUploadSingle = (props: {
	key: string;
	data: Readable | Buffer;
	meta: MediaMetaDataT;
}) => Promise<{
	success: boolean;
	message: string;
	response: {
		etag?: string;
	} | null;
}>;
export type MediaStrategyUpdateSingle = (
	oldKey: string,
	props: {
		key: string;
		data: Readable | Buffer;
		meta: MediaMetaDataT;
	},
) => Promise<{
	success: boolean;
	message: string;
	response: {
		etag?: string;
	} | null;
}>;
export type MediaStrategyDeleteSingle = (key: string) => Promise<{
	success: boolean;
	message: string;
}>;
export type MediaStrategyDeleteMultiple = (keys: string[]) => Promise<{
	success: boolean;
	message: string;
}>;

export type MediaStrategy = {
	stream: MediaStrategyStream;
	uploadSingle: MediaStrategyUploadSingle;
	updateSingle: MediaStrategyUpdateSingle;
	deleteSingle: MediaStrategyDeleteSingle;
	deleteMultiple: MediaStrategyDeleteMultiple;
};

// the version of config that is used in the headless.config.ts file
export interface HeadlessConfig {
	mode: "production" | "development";
	db: DatabaseAdapterT;
	host: string;
	keys: {
		cookieSecret: string;
		accessTokenSecret: string;
		refreshTokenSecret: string;
	};
	paths?: {
		emailTemplates?: string;
	};
	email?: {
		from: {
			email: string;
			name: string;
		};
		strategy: EmailStrategy;
	};
	media?: {
		storage?: number;
		maxSize?: number;
		processed?: {
			limit?: number;
			store?: boolean;
		};
		fallbackImage?: string | boolean | undefined;
		stategy?: MediaStrategy;
	};
	collections?: CollectionBuilderT[];
	plugins?: HeadlessPlugin[];
}

export interface Config extends z.infer<typeof ConfigSchema> {
	mode: "production" | "development";
	db: DatabaseAdapterT;
	email?: {
		from: {
			email: string;
			name: string;
		};
		strategy: EmailStrategy;
	};
	media: {
		storage: number;
		maxSize: number;
		processed: {
			limit: number;
			store: boolean;
		};
		fallbackImage: string | boolean | undefined;
		stategy?: MediaStrategy;
	};
	collections: CollectionBuilderT[];
	plugins: Array<HeadlessPlugin>;
}
