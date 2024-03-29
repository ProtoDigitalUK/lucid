import type {
	KyselyPlugin,
	PluginTransformQueryArgs,
	PluginTransformResultArgs,
	QueryResult,
	RootOperationNode,
	UnknownRow,
} from "kysely";

export type DrainOuterGeneric<T> = [T] extends [unknown] ? T : never;
export type Simplify<T> = DrainOuterGeneric<{ [K in keyof T]: T[K] } & {}>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ShallowRecord<K extends keyof any, T> = DrainOuterGeneric<{
	[P in K]: T;
}>;

export class ParseJSONResultsPlugin implements KyselyPlugin {
	// noop
	transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
		return args.node;
	}
	async transformResult(
		args: PluginTransformResultArgs,
	): Promise<QueryResult<UnknownRow>> {
		return {
			...args.result,
			rows: parseArray(args.result.rows),
		};
	}
}

function parseArray<T>(arr: T[]): T[] {
	for (let i = 0; i < arr.length; ++i) {
		arr[i] = parse(arr[i]) as T;
	}

	return arr;
}

function parse(obj: unknown): unknown {
	if (isString(obj)) {
		return parseString(obj);
	}

	if (Array.isArray(obj)) {
		return parseArray(obj);
	}

	if (isPlainObject(obj)) {
		return parseObject(obj);
	}

	return obj;
}

function parseString(str: string): unknown {
	if (maybeJson(str)) {
		try {
			return parse(JSON.parse(str));
		} catch (err) {
			// this catch block is intentionally empty.
		}
	}

	return str;
}

function maybeJson(value: string): boolean {
	return value.match(/^[\[\{]/) != null;
}
function parseObject(obj: Record<string, unknown>): Record<string, unknown> {
	// ** Fixes bug with @libsql/hrana-client? used in libsql dialect. Obj is immutable (writable: false). Only on executeTakeFirst/executeTakeFirstOrThrow?
	// biome-ignore lint/style/noParameterAssign: <explanation>
	obj = Object.assign({}, obj);

	for (const key in obj) {
		obj[key] = parse(obj[key]);
	}

	return obj;
}
export function isString(obj: unknown): obj is string {
	return typeof obj === "string";
}
export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
	return (
		isObject(obj) &&
		!Array.isArray(obj) &&
		!isDate(obj) &&
		!isBuffer(obj) &&
		!isArrayBufferOrView(obj)
	);
}
export function isObject(obj: unknown): obj is ShallowRecord<string, unknown> {
	return typeof obj === "object" && obj !== null;
}
export function isDate(obj: unknown): obj is Date {
	return obj instanceof Date;
}
export function isBuffer(obj: unknown): obj is { length: number } {
	return typeof Buffer !== "undefined" && Buffer.isBuffer(obj);
}
export function isArrayBufferOrView(
	obj: unknown,
): obj is ArrayBuffer | ArrayBufferView {
	return obj instanceof ArrayBuffer || ArrayBuffer.isView(obj);
}
