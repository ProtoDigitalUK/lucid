import { FastifyRequest } from "fastify";
import z, { AnyZodObject } from "zod";
import constants from "@root/constants.js";
// Utils
import { LucidError } from "@utils/app/error-handler.js";

// ------------------------------------
// Schemas
const querySchema = z.object({
  include: z.string().optional(),
  exclude: z.string().optional(),
  filter: z.object({}).optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});

export type QueryType = z.infer<typeof querySchema>;

// ------------------------------------
// Build Functions
const buildFilter = (query: QueryType) => {
  let filter:
    | {
        [key: string]: string | Array<string>;
      }
    | undefined = undefined;

  Array.from(Object.entries(query.filter || {})).forEach(([key, value]) => {
    const v = value as string;
    if (!filter) filter = {};
    if (v.includes(",")) {
      filter[key] = v.split(",");
    } else {
      if (v !== "") filter[key] = v;
    }
  });

  return filter;
};
const buildInclude = (query: QueryType) => {
  let include: Array<string> | undefined = undefined;

  include = query.include?.split(",");

  return include;
};
const buildExclude = (query: QueryType) => {
  let exclude: Array<string> | undefined = undefined;

  exclude = query.exclude?.split(",");

  return exclude;
};
const buildSort = (query: QueryType) => {
  let sort:
    | Array<{
        key: string;
        value: "asc" | "desc";
      }>
    | undefined = undefined;

  sort = query.sort?.split(",").map((sort) => {
    if (sort.startsWith("-")) {
      return {
        key: sort.slice(1),
        value: "desc",
      };
    } else {
      return {
        key: sort,
        value: "asc",
      };
    }
  });

  return sort;
};
const buildPage = (query: QueryType) => {
  let page: string | undefined = undefined;

  // check if it can be converted to number
  if (query.page) {
    const pageInt = parseInt(query.page);
    if (!isNaN(pageInt)) {
      page = pageInt.toString();
    } else {
      page = "1";
    }
  }

  return page;
};
const buildPerPage = (query: QueryType) => {
  let per_page: string | undefined = undefined;

  // check if it can be converted to number
  if (query.per_page) {
    const per_pageInt = parseInt(query.per_page);
    if (!isNaN(per_pageInt)) {
      per_page = per_pageInt.toString();
    } else {
      per_page = constants.pagination.perPage;
    }
  }

  return per_page;
};

// ------------------------------------
// Functions
const addRemainingQuery = (query: QueryType) => {
  const remainingQuery = Object.fromEntries(
    Object.entries(query).filter(
      ([key]) =>
        !["include", "exclude", "filter", "sort", "page", "per_page"].includes(
          key
        )
    )
  );
  return remainingQuery;
};

// ------------------------------------
// Validate Middleware
const validate =
  (schema: AnyZodObject) =>
  async (request: FastifyRequest<{ Querystring: QueryType }>) => {
    const parseData: {
      body?: any;
      query?: {
        include?: ReturnType<typeof buildInclude>;
        exclude?: ReturnType<typeof buildExclude>;
        filter?: ReturnType<typeof buildFilter>;
        sort?: ReturnType<typeof buildSort>;
        page?: ReturnType<typeof buildPage>;
        per_page?: ReturnType<typeof buildPerPage>;
      };
      params?: any;
    } = {};

    parseData.body = request.body || {};
    parseData.params = request.params || {};
    parseData.query = {
      include: buildInclude(request.query),
      exclude: buildExclude(request.query),
      filter: buildFilter(request.query),
      sort: buildSort(request.query),
      page: buildPage(request.query),
      per_page: buildPerPage(request.query),
      ...addRemainingQuery(request.query),
    };

    if (Object.keys(parseData).length === 0) {
      return; // Continue with the request processing
    }

    const validateResult = await schema.safeParseAsync(parseData);

    if (!validateResult.success) {
      throw new LucidError({
        type: "validation",
        message: "Please check your fields for any errors.",
        zod: validateResult.error,
      });
    } else {
      request.body = validateResult.data.body;
      request.query = validateResult.data.query;
      request.params = validateResult.data.params;
    }
  };

export default validate;
