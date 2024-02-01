import { FastifyInstance } from "fastify";
import z from "zod";

type RouteT = <
	ParamsT extends z.ZodTypeAny,
	BodyT extends z.ZodTypeAny,
	QueryT extends z.ZodTypeAny,
>(
	fastify: FastifyInstance,
	opts: {
		method: "get" | "post" | "put" | "delete" | "patch";
		url: string;
		// permissions?: {
		//   global?: PermissionT[];
		//   environments?: EnvironmentPermissionT[];
		// };
		// middleware?: {
		//   authenticate?: boolean;
		//   authoriseCSRF?: boolean;
		//   paginated?: boolean;
		//   validateEnvironment?: boolean;
		//   contentLanguage?: boolean;
		// };
		// zodSchema?: {
		//   params?: ParamsT;
		//   body?: BodyT;
		//   query?: QueryT;
		// };
		swaggerSchema?: {
			description?: string;
			tags?: string[];
			summary?: string;
			response?: {
				200?: {
					description?: string;
					type?: string;
					properties?: unknown;
				};
			};
		};
		controller: ControllerT<ParamsT, BodyT, QueryT>;
	},
) => void;

const route: RouteT = (fastify, opts) => {
	const { method, url, controller, swaggerSchema } = opts;

	fastify.route({
		method: method,
		url: url,
		handler: controller,
		schema: swaggerSchema,
	});
};

export default route;
