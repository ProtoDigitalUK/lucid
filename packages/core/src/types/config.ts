import type z from "zod";
import type CollectionBuilder from "../libs/builders/collection-builder/index.js";
import type DatabaseAdapter from "../libs/db/adapter.js";
import type ConfigSchema from "../libs/config/config-schema.js";
import type { Readable } from "node:stream";
import type { MediaKitMeta } from "../libs/media-kit/index.js";
import type { AllHooks } from "./hooks.js";
import type { ServiceResponse } from "../utils/services/types.js";
import type { FastifyInstance } from "fastify";

export type LucidPlugin = (config: Config) => Promise<{
	key: string;
	lucid: string;
	config: Config;
}>;

export type LucidPluginOptions<T> = (
	config: Config,
	pluginOptions: T,
) => Promise<{
	key: string;
	lucid: string;
	config: Config;
}>;

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

export type MediaStrategyGetPresignedUrl = (
	key: string,
	meta: {
		host: string;
		mimeType: string;
		extension?: string;
	},
) => ServiceResponse<{
	url: string;
}>;

export type MediaStrategyGetMeta = (key: string) => ServiceResponse<{
	size: number;
	mimeType: string | null;
	etag: string | null;
}>;

export type MediaStrategyStream = (key: string) => ServiceResponse<{
	contentLength: number | undefined;
	contentType: string | undefined;
	body: Readable;
}>;

export type MediaStrategyUploadSingle = (props: {
	key: string;
	data: Readable | Buffer;
	meta: Omit<
		MediaKitMeta,
		| "blurHash"
		| "averageColour"
		| "isDark"
		| "isLight"
		| "tempPath"
		| "name"
		| "key"
		| "etag"
	>;
}) => ServiceResponse<{
	etag?: string;
}>;

export type MediaStrategyDeleteSingle = (
	key: string,
) => ServiceResponse<undefined>;
export type MediaStrategyDeleteMultiple = (
	keys: string[],
) => ServiceResponse<undefined>;

export type MediaStrategy = {
	getPresignedUrl: MediaStrategyGetPresignedUrl;
	getMeta: MediaStrategyGetMeta;
	stream: MediaStrategyStream;
	uploadSingle: MediaStrategyUploadSingle;
	deleteSingle: MediaStrategyDeleteSingle;
	deleteMultiple: MediaStrategyDeleteMultiple;
};

// the version of config that is used in the lucid.config.ts file
export interface LucidConfig {
	db: DatabaseAdapter;
	host: string;
	keys: {
		encryptionKey: string;
		cookieSecret: string;
		accessTokenSecret: string;
		refreshTokenSecret: string;
	};
	disableSwagger?: boolean;
	localisation?: {
		locales: {
			label: string;
			code: string;
		}[];
		defaultLocale: string;
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
		strategy?: MediaStrategy;
	};
	fastifyExtensions?: Array<(fastify: FastifyInstance) => Promise<void>>;
	hooks?: Array<AllHooks>;
	collections?: CollectionBuilder[];
	plugins?: LucidPlugin[];
}

export interface Config extends z.infer<typeof ConfigSchema> {
	db: DatabaseAdapter;
	email?: {
		from: {
			email: string;
			name: string;
		};
		strategy: EmailStrategy;
	};
	disableSwagger: boolean;
	localisation: {
		locales: {
			label: string;
			code: string;
		}[];
		defaultLocale: string;
	};
	media: {
		storage: number;
		maxSize: number;
		processed: {
			limit: number;
			store: boolean;
		};
		fallbackImage: string | boolean | undefined;
		strategy?: MediaStrategy;
	};
	fastifyExtensions: Array<(fastify: FastifyInstance) => Promise<void>>;
	hooks: Array<AllHooks>;
	collections: CollectionBuilder[];
	plugins: Array<LucidPlugin>;
}
