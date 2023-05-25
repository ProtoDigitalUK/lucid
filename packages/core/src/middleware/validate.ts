import { Request, Response, NextFunction } from "express";
import z, { AnyZodObject } from "zod";
// Utils
import { LucidError } from "@utils/error-handler";
// ------------------------------------
// Schemas
const querySchema = z.object({
  include: z.string().optional(),
  exclude: z.string().optional(),
  filter: z.object({}).optional(),
  sort: z.string().optional(),
});

// ------------------------------------
// Build Functions
const buildFilter = (query: z.infer<typeof querySchema>) => {
  let filter:
    | {
        [key: string]: string;
      }
    | undefined = undefined;

  filter = query.filter;

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
