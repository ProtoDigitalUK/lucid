import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
// Utils
import { LucidError } from "@utils/error-handler";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseData: {
        body?: any;
        query?: any;
        params?: any;
      } = {};
      parseData["body"] = req.body;
      parseData["query"] = req.query;
      parseData["params"] = req.params;
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
