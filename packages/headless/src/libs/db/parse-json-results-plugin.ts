import {
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
		const first = args.result.rows[0];
		console.log(isPropertyReadOnly(first, "id"));

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
	// console.log(isPropertyReadOnly(obj, "id"));
	// obj = { ...obj }; // TODO: ob is not writable - debug why

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

function isPropertyReadOnly(
	obj: Record<string, unknown>,
	propName: string,
): boolean {
	const descriptor = Object.getOwnPropertyDescriptor(obj, propName);

	// If the descriptor does not exist, the property is not defined on the object
	if (!descriptor) return false;

	// Check if property is writable, considering both the descriptor and whether the object is frozen
	return !descriptor.writable;
}
