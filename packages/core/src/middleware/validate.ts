import { Request, Response, NextFunction } from "express";
import z, { AnyZodObject } from "zod";
import constants from "@root/constants";
// Utils
import { LucidError } from "@utils/app/error-handler";

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

// ------------------------------------
// Build Functions
const buildFilter = (query: z.infer<typeof querySchema>) => {
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
      filter[key] = v;
    }
  });

  return filter;
};
const buildInclude = (query: z.infer<typeof querySchema>) => {
  let include: Array<string> | undefined = undefined;

  include = query.include?.split(",");

  return include;
};
const buildExclude = (query: z.infer<typeof querySchema>) => {
  let exclude: Array<string> | undefined = undefined;

  exclude = query.exclude?.split(",");

  return exclude;
};
const buildSort = (query: z.infer<typeof querySchema>) => {
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
const buildPage = (query: z.infer<typeof querySchema>) => {
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
const buildPerPage = (query: z.infer<typeof querySchema>) => {
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
// Validate Middleware
const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseData: {
        body?: any;
        query?: {
          include?: any;
          exclude?: any;
          filter?: any;
          sort?: any;
          page?: any;
          per_page?: any;
        };
        params?: any;
      } = {};

      parseData["body"] = req.body;
      parseData["params"] = req.params;
      parseData["query"] = {
        include: buildInclude(req.query),
        exclude: buildExclude(req.query),
        filter: buildFilter(req.query),
        sort: buildSort(req.query),
        page: buildPage(req.query),
        per_page: buildPerPage(req.query),
      };

      if (Object.keys(parseData).length === 0) return next();

      const validate = await schema.safeParseAsync(parseData);
      if (!validate.success) {
        throw new LucidError({
          type: "validation",
          zod: validate.error,
        });
      } else {
        req.body = validate.data.body;
        req.query = validate.data.query;
        req.params = validate.data.params;
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };

export default validate;
