import type { BrickSchemaT } from "../schemas/collection-bricks.js";
import type { FieldCollectionSchemaT } from "../schemas/collection-fields.js";

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
			meta: {
				collection_key: string;
				user_id: number;
			};
			data: {
				document_id?: number;
				bricks?: Array<BrickSchemaT>;
				fields?: Array<FieldCollectionSchemaT>;
			};
		}) =>
			| Promise<{
					document_id?: number;
					bricks?: Array<BrickSchemaT>;
					fields?: Array<FieldCollectionSchemaT>;
			  }>
			| Promise<void>;
		afterUpsert: (props: {
			meta: {
				collection_key: string;
				user_id: number;
			};
			data: {
				document_id?: number;
				bricks?: Array<BrickSchemaT>;
				fields?: Array<FieldCollectionSchemaT>;
			};
		}) => Promise<void>;
		beforeDelete: (props: {
			meta: {
				collection_key: string;
				user_id: number;
			};
			data: {
				ids: number[];
			};
		}) => Promise<void>;
		afterDelete: (props: {
			meta: {
				collection_key: string;
				user_id: number;
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
