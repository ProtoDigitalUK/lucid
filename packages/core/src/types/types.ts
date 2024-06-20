import type z from "zod";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { Config } from "./config.js";

import type {
	UserPermissionsResponse,
	LocalesResponse,
	MediaResponse,
} from "./response.js";
import type { BooleanInt } from "../libs/db/types.js";
import type lucidLogger from "../utils/logging/index.js";

declare module "fastify" {
	interface FastifyInstance {
		config: Config;
		logger: typeof lucidLogger;
	}

	interface FastifyRequest {
		auth: {
			id: number;
			username: string;
			email: string;
			superAdmin: BooleanInt;
			permissions: UserPermissionsResponse["permissions"] | undefined;
		};
		locale: {
			code: LocalesResponse["code"];
		};
		server: FastifyInstance;
	}
}

export type RouteController<
	P extends z.ZodTypeAny | undefined,
	B extends z.ZodTypeAny | undefined,
	Q extends z.ZodTypeAny | undefined,
> = (
	request: FastifyRequest<{
		// @ts-expect-error
		Params: z.infer<P>;
		// @ts-expect-error
		Body: z.infer<B>;
		// @ts-expect-error
		Querystring: z.infer<Q>;
	}>,
	reply: FastifyReply,
) => void;

export interface RouteMediaMetaData {
	mimeType: string;
	fileExtension: string;
	size: number;
	width: number | null;
	height: number | null;
	type: MediaResponse["type"];
	key: string;
	etag?: string;
}
