import type { BrickSchema } from "../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../schemas/collection-fields.js";
import type { KyselyDB } from "../libs/db/types.js";

// --------------------------------------------------
// types

export interface LucidHook<
	S extends keyof HookServiceHandlers,
	E extends keyof HookServiceHandlers[S],
> {
	service: S;
	event: E;
	handler: HookServiceHandlers[S][E];
}

export interface LucidHookCollection<
	E extends keyof HookServiceHandlers["collection-documents"],
> {
	event: E;
	handler: HookServiceHandlers["collection-documents"][E];
}

export type ArgumentsType<T> = T extends (...args: infer U) => unknown
	? U
	: never;

// --------------------------------------------------
// service handlers

export type HookServiceHandlers = {
	"collection-documents": {
		beforeUpsert: (props: {
			db: KyselyDB;
			meta: {
				collectionKey: string;
				userId: number;
			};
			data: {
				documentId?: number;
				bricks?: Array<BrickSchema>;
				fields?: Array<FieldSchemaType>;
			};
		}) =>
			| Promise<{
					documentId?: number;
					bricks?: Array<BrickSchema>;
					fields?: Array<FieldSchemaType>;
			  }>
			| Promise<void>;
		afterUpsert: (props: {
			db: KyselyDB;
			meta: {
				collectionKey: string;
				userId: number;
			};
			data: {
				documentId?: number;
				bricks?: Array<BrickSchema>;
				fields?: Array<FieldSchemaType>;
			};
		}) => Promise<void>;
		beforeDelete: (props: {
			db: KyselyDB;
			meta: {
				collectionKey: string;
				userId: number;
			};
			data: {
				ids: number[];
			};
		}) => Promise<void>;
		afterDelete: (props: {
			db: KyselyDB;
			meta: {
				collectionKey: string;
				userId: number;
			};
			data: {
				ids: number[];
			};
		}) => Promise<void>;
	};
};

// --------------------------------------------------
// service config

// used for collection builder hook config
export type CollectionDocumentBuilderHooks =
	| LucidHookCollection<"beforeUpsert">
	| LucidHookCollection<"afterUpsert">
	| LucidHookCollection<"beforeDelete">
	| LucidHookCollection<"afterDelete">;

export type CollectionDocumentHooks =
	| LucidHook<"collection-documents", "beforeUpsert">
	| LucidHook<"collection-documents", "afterUpsert">
	| LucidHook<"collection-documents", "beforeDelete">
	| LucidHook<"collection-documents", "afterDelete">;

// add all hooks to this type
export type AllHooks = CollectionDocumentHooks;
