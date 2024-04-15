import type z from "zod";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { Config } from "./config.ts";
import type { Kysely } from "kysely";
import type { UserPermissionsResT, LanguageResT } from "./response.js";
import type { HeadlessDB, BooleanInt } from "../libs/db/types.ts";
import type headlessLogger from "../libs/logging/index.ts";

declare module "fastify" {
	interface FastifyInstance {
		config: Config;
		logger: typeof headlessLogger;
	}

	interface FastifyRequest {
		auth: {
			id: number;
			username: string;
			email: string;
			superAdmin: BooleanInt;
			permissions: UserPermissionsResT["permissions"] | undefined;
		};
		language: {
			id: LanguageResT["id"];
			code: LanguageResT["code"];
		};
		server: FastifyInstance;
	}
}

declare global {
	type DB = Kysely<HeadlessDB>;

	type ControllerT<ParamsT, BodyT, QueryT> = (
		request: FastifyRequest<{
			Params: z.infer<ParamsT>;
			Body: z.infer<BodyT>;
			Querystring: z.infer<QueryT>;
		}>,
		reply: FastifyReply,
	) => void;

	interface ServiceConfigT {
		db: DB;
		config: Config;
		inTransaction?: boolean; // If the function is within a transaction
	}

	interface ResponseBodyT {
		data: unknown;
		links?: {
			first: string | null;
			last: string | null;
			next: string | null;
			prev: string | null;
		};
		meta: {
			links?: Array<{
				active: boolean;
				label: string;
				url: string | null;
				page: number;
			}>;
			path: string;

			currentPage?: number | null;
			lastPage?: number | null;
			perPage?: number | null;
			total?: number | null;
		};
	}

	declare module "kysely" {
		export type ComparisonOperatorExpression =
			| ComparisonOperatorExpression
			| "%";
	}
}
