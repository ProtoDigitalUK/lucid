import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { Config } from "../libs/config/config-schema.js";
import type z from "zod";
import type { Kysely } from "kysely";
import type { UserPermissionsResT } from "@headless/types/src/users.js";
import type { LanguageResT } from "@headless/types/src/language.js";
import type { DB as DBSchema } from "kysely-codegen";

declare module "fastify" {
	interface FastifyInstance {
		db: DB;
		config: Config;
	}

	interface FastifyRequest {
		auth: {
			id: number;
			username: string;
			email: string;
			super_admin: boolean;
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
	type DB = Kysely<DBSchema>;

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

			current_page?: number | null;
			last_page?: number | null;
			per_page?: number | null;
			total?: number | null;
		};
	}
}
