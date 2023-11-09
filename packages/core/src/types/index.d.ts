import { Fastify, FastifyRequest, FastifyReply } from "fastify";
import type { LanguageResT } from "@lucid/types/src/language.js";
import z from "zod";

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      id: number;
      email: string;
      username: string;
    };
    language: {
      id: LanguageResT["id"];
      code: LanguageResT["code"];
    };
  }
}

declare global {
  // --------------------------------------------------
  // Init
  interface InitOptions {
    fastify: Fastify.FastifyInstance;
  }

  // --------------------------------------------------
  // Controller
  type Controller<ParamsT, BodyT, QueryT> = (
    request: FastifyRequest<{
      Params: z.infer<ParamsT>;
      Body: z.infer<BodyT>;
      Querystring: z.infer<QueryT>;
    }>,
    reply: FastifyReply
  ) => void;

  interface ResponseBody {
    data: Array<any> | { [key: string]: any } | undefined | null;
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

  // --------------------------------------------------
  // Model
  interface ModelQueryParams {
    include?: Array<string>;
    exclude?: Array<string>;
    filter?: {
      [key: string]: string | Array<string>;
    };
    sort?: Array<{
      key: string;
      value: "asc" | "desc";
    }>;
    page?: string;
    per_page?: string;
  }
}
