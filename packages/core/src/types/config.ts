import type z from "zod";
import type CollectionBuilder from "../libs/builders/collection-builder/index.js";
import type DatabaseAdapter from "../libs/db/adapter.js";
import type ConfigSchema from "../libs/config/config-schema.js";
import type { Readable } from "node:stream";
import type { RouteMediaMetaData } from "../utils/media-helpers.js";
import type { AllHooks } from "./hooks.js";

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
	meta: RouteMediaMetaData;
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
		meta: RouteMediaMetaData;
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

// the version of config that is used in the lucid.config.ts file
export interface LucidConfig {
	mode: "production" | "development";
	db: DatabaseAdapter;
	host: string;
	keys: {
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
	hooks?: Array<AllHooks>;
	collections?: CollectionBuilder[];
	plugins?: LucidPlugin[];
}

export interface Config extends z.infer<typeof ConfigSchema> {
	mode: "production" | "development";
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
	hooks: Array<AllHooks>;
	collections: CollectionBuilder[];
	plugins: Array<LucidPlugin>;
}
