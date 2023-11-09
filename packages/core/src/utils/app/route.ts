import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
// Middleware
import authenticate from "@middleware/authenticate.js";
import authoriseCSRF from "@middleware/authorise-csrf.js";
import fastifyMultipart from "@fastify/multipart";
import validate, { QueryType } from "@middleware/validate.js";
import paginated from "@middleware/paginated.js";
import validateEnvironment from "@middleware/validate-environment.js";
import permissions from "@middleware/permissions.js";
import contentLanguage from "@middleware/content-language.js";
// Types
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/types/src/permissions.js";

type RouteT = <
  ParamsT extends z.ZodTypeAny,
  BodyT extends z.ZodTypeAny,
  QueryT extends z.ZodTypeAny
>(
  fastify: FastifyInstance,
  opts: {
    method: "get" | "post" | "put" | "delete" | "patch";
    url: string;
    permissions?: {
      global?: PermissionT[];
      environments?: EnvironmentPermissionT[];
    };
    middleware?: {
      fileUpload?: boolean;
      authenticate?: boolean;
      authoriseCSRF?: boolean;
      paginated?: boolean;
      validateEnvironment?: boolean;
      contentLanguage?: boolean;
    };
    schema?: {
      params?: ParamsT;
      body?: BodyT;
      query?: QueryT;
    };
    controller: Controller<ParamsT, BodyT, QueryT>;
  }
) => void;

const route: RouteT = (fastify, opts) => {
  const { method, url, controller, middleware, schema } = opts;

  const preHandler: Array<
    (
      request: FastifyRequest<{
        Querystring: QueryType;
      }>,
      reply: FastifyReply
    ) => Promise<void>
  > = [];

  if (middleware?.authenticate) preHandler.push(authenticate);
  if (middleware?.authoriseCSRF) preHandler.push(authoriseCSRF);
  if (middleware?.fileUpload) fastify.register(fastifyMultipart);
  if (schema?.params || schema?.body || schema?.query) {
    preHandler.push(
      validate(
        z.object({
          params: schema?.params ?? z.object({}),
          query: schema?.query ?? z.object({}),
          body: schema?.body ?? z.object({}),
        })
      )
    );
  }
  if (middleware?.paginated) preHandler.push(paginated);
  if (middleware?.validateEnvironment) preHandler.push(validateEnvironment);
  if (opts.permissions) preHandler.push(permissions(opts.permissions));
  if (middleware?.contentLanguage) preHandler.push(contentLanguage);

  fastify.route({
    method: method,
    url: url,
    preHandler: preHandler,
    handler: controller,
  });
};

export default route;
