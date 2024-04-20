import type { BrickSchema } from "../schemas/collection-bricks.js";
import type { FieldSchemaType } from "../schemas/collection-fields.js";
import type { GroupSchemaType } from "../schemas/collection-groups.js";
import type { KyselyDB } from "../libs/db/types.js";

// --------------------------------------------------
// types

export interface HeadlessHook<
	S extends keyof HookServiceHandlers,
	E extends keyof HookServiceHandlers[S],
> {
	service: S;
	event: E;
	handler: HookServiceHandlers[S][E];
}

export interface HeadlessHookCollection<
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
				groups?: Array<GroupSchemaType>;
			};
		}) =>
			| Promise<{
					documentId?: number;
					bricks?: Array<BrickSchema>;
					fields?: Array<FieldSchemaType>;
					groups?: Array<GroupSchemaType>;
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
				groups?: Array<GroupSchemaType>;
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
	| HeadlessHookCollection<"beforeUpsert">
	| HeadlessHookCollection<"afterUpsert">
	| HeadlessHookCollection<"beforeDelete">
	| HeadlessHookCollection<"afterDelete">;

export type CollectionDocumentHooks =
	| HeadlessHook<"collection-documents", "beforeUpsert">
	| HeadlessHook<"collection-documents", "afterUpsert">
	| HeadlessHook<"collection-documents", "beforeDelete">
	| HeadlessHook<"collection-documents", "afterDelete">;

// add all hooks to this type
export type AllHooks = CollectionDocumentHooks;
