export interface HeadlessHook<
	S extends keyof HookServiceHandlers,
	E extends keyof HookServiceHandlers[S],
> {
	service: S;
	event: E;
	handler: HookServiceHandlers[S][E];
}

// --------------------------------------------------
// service handlers
export type HookServiceHandlers = {
	"collection-documents": {
		beforeValidate: (data: unknown, context: unknown) => Promise<void>;
		beforeCreate: (data: "hello", context: "test") => Promise<void>;
		afterCreate: (data: unknown, context: unknown) => Promise<void>;
		beforeUpdate: (data: unknown, context: unknown) => Promise<void>;
		afterUpdate: (data: unknown, context: unknown) => Promise<void>;
		beforeDelete: (data: unknown, context: "unknown") => Promise<void>;
		afterDelete: (data: unknown, context: unknown) => Promise<void>;
		beforeRead: (data: unknown, context: unknown) => Promise<void>;
		afterRead: (data: unknown, context: unknown) => Promise<void>;
		beforeResponse: (data: unknown, context: unknown) => Promise<void>;
	};
	media: {
		beforeValidate: (data: unknown, context: unknown) => Promise<void>;
		beforeCreate: (data: unknown, context: unknown) => Promise<void>;
		afterCreate: (data: unknown, context: unknown) => Promise<void>;
		beforeUpdate: (data: unknown, context: unknown) => Promise<void>;
		afterUpdate: (data: unknown, context: unknown) => Promise<void>;
		beforeDelete: (data: unknown, context: unknown) => Promise<void>;
		afterDelete: (data: unknown, context: unknown) => Promise<void>;
		beforeRead: (data: unknown, context: unknown) => Promise<void>;
		afterRead: (data: unknown, context: unknown) => Promise<void>;
		beforeResponse: (data: unknown, context: unknown) => Promise<void>;
	};
};

export type CollectionDocumentHooks =
	| HeadlessHook<"collection-documents", "beforeValidate">
	| HeadlessHook<"collection-documents", "beforeCreate">
	| HeadlessHook<"collection-documents", "afterCreate">
	| HeadlessHook<"collection-documents", "beforeUpdate">
	| HeadlessHook<"collection-documents", "afterUpdate">
	| HeadlessHook<"collection-documents", "beforeDelete">
	| HeadlessHook<"collection-documents", "afterDelete">
	| HeadlessHook<"collection-documents", "beforeRead">
	| HeadlessHook<"collection-documents", "afterRead">
	| HeadlessHook<"collection-documents", "beforeResponse">;

export type MediaHooks =
	| HeadlessHook<"media", "beforeValidate">
	| HeadlessHook<"media", "beforeCreate">
	| HeadlessHook<"media", "afterCreate">
	| HeadlessHook<"media", "beforeUpdate">
	| HeadlessHook<"media", "afterUpdate">
	| HeadlessHook<"media", "beforeDelete">
	| HeadlessHook<"media", "afterDelete">
	| HeadlessHook<"media", "beforeRead">
	| HeadlessHook<"media", "afterRead">
	| HeadlessHook<"media", "beforeResponse">;

export type AllHooks = CollectionDocumentHooks | MediaHooks;
