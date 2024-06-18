import type { ZodType } from "zod";
import type { Config } from "../../types/config.js";
import type { KyselyDB } from "../db/types.js";
import type { LucidErrorData } from "../../types/errors.js";

export type ServiceConfig = {
	db: KyselyDB;
	config: Config;
};
export type ServiceProps<T> = {
	serviceConfig?: ServiceConfig;
	data?: T;
	[key: string]: unknown;
};

export type ServiceWrapperConfig = {
	transaction: boolean; //* Decides whether the db queries should be within a transaction or not
	schema?: ZodType<unknown>;
	schemaArgIndex?: number; //* The index of the argument to parse the schema against
	defaultError?: Omit<Partial<LucidErrorData>, "zod" | "errorResponse">;
	logError?: boolean;
};

export type ServiceResponse<T> = Promise<
	{ error: LucidErrorData; data: undefined } | { error: undefined; data: T }
>;

export type ServiceFn<T extends unknown[], R> = (
	service: ServiceConfig,
	...args: T
) => ServiceResponse<R>;
