import type { ZodType, ZodError } from "zod";
import type { ErrorResult } from "../../types/errors.js";
import type { Config } from "../../types/config.js";
import type { KyselyDB } from "../db/types.js";

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
	defaultError?: Omit<Partial<ServiceError>, "zod" | "errorResponse">;
};

export type ServiceError = {
	type: "validation" | "basic" | "forbidden" | "authorisation";

	name?: string;
	message?: string;
	status?: number;
	code?: "csrf" | "login" | "authorisation";
	zod?: ZodError;
	errorResponse?: ErrorResult;
};

export type ServiceResponse<T> = Promise<{
	error: ServiceError | undefined;
	data: T | undefined;
}>;

export type ServiceFn<T extends unknown[], R> = (
	service: ServiceConfig,
	...args: T
) => ServiceResponse<R>;
