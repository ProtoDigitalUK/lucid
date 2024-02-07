import {
	type FastifyInstance,
	type FastifyRequest,
	type FastifyReply,
} from "fastify";
import z from "zod";
import validateBody from "../../middleware/validate-body.js";
import validateParams from "../../middleware/validate-params.js";
import validateQuery from "../../middleware/validate-query.js";
import authenticate from "../../middleware/authenticate.js";
import validateCSRF from "../../middleware/validate-csrf.js";

type RouteT = <
	ParamsT extends z.ZodTypeAny | undefined,
	BodyT extends z.ZodTypeAny | undefined,
	QueryT extends z.ZodTypeAny | undefined,
>(
	fastify: FastifyInstance,
	opts: {
		method: "get" | "post" | "put" | "delete" | "patch";
		url: string;
		// permissions?: {
		//   global?: PermissionT[];
		//   environments?: EnvironmentPermissionT[];
		// };
		middleware?: {
			authenticate?: boolean;
			validateCSRF?: boolean;
			paginated?: boolean;
			// validateEnvironment?: boolean;
			// contentLanguage?: boolean;
		};
		zodSchema?: {
			params?: ParamsT;
			body?: BodyT;
			query?: QueryT;
		};
		swaggerSchema?: {
			description?: string;
			tags?: string[];
			summary?: string;
			response?: Record<
				string | number,
				{
					description?: string;
					type?: string;
					properties?: unknown;
				}
			>;
			body?: {
				type?: string;
				properties?: unknown;
				required?: string[];
			};
			headers?: {
				type: string;
				properties: unknown;
				required: string[];
			};
		};
		controller: ControllerT<ParamsT, BodyT, QueryT>;
	},
) => void;

type PreHookT = Array<
	(request: FastifyRequest, reply: FastifyReply) => Promise<void>
>;

const route: RouteT = (fastify, opts) => {
	const { method, url, controller, swaggerSchema, zodSchema, middleware } =
		opts;

	const preValidation: PreHookT = [];
	const preHandler: PreHookT = [];

	if (middleware?.authenticate) preHandler.push(authenticate);
	if (middleware?.validateCSRF) preHandler.push(validateCSRF);

	if (zodSchema?.body !== undefined)
		preValidation.push(validateBody(zodSchema.body));
	if (zodSchema?.params !== undefined)
		preValidation.push(validateParams(zodSchema.params));
	if (zodSchema?.query !== undefined)
		preValidation.push(validateQuery(zodSchema.query));

	fastify.route({
		method: method,
		url: url,
		handler: controller,
		preValidation: preValidation,
		preHandler: preHandler,
		schema: swaggerSchema,
	});
};

export default route;
