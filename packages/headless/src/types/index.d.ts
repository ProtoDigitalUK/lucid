import {
	type FastifyInstance,
	type FastifyRequest,
	type FastifyReply,
} from "fastify";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../db/schema.js";
import { type HeadlessConfigT } from "../schemas/config.js";
import z from "zod";

declare module "fastify" {
	interface FastifyInstance {
		db: DB;
		config: HeadlessConfigT;
	}

	interface FastifyRequest {
		auth: {
			id: number;
			email: string;
			username: string;
			// TODO: add permissions
		};
		language: {
			id: LanguageResT["id"];
			code: LanguageResT["code"];
		};
		server: FastifyInstance;
	}
}

declare global {
	type DB = PostgresJsDatabase<typeof schema>;

	type ControllerT<ParamsT, BodyT, QueryT> = (
		request: FastifyRequest<{
			Params: z.infer<ParamsT>;
			Body: z.infer<BodyT>;
			Querystring: z.infer<QueryT>;
		}>,
		reply: FastifyReply,
	) => void;

	interface ResponseBodyT {
		data: Array<unknown> | { [key: string]: unknown } | undefined | null;
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
