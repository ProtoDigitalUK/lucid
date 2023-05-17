import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseData: {
        body?: any;
        query?: any;
        params?: any;
      } = {};
      if (req.body && Object.keys(req.body).length > 0) {
        parseData["body"] = req.body;
      }
      if (req.query && Object.keys(req.query).length > 0) {
        parseData["query"] = req.query;
      }
      if (req.params && Object.keys(req.params).length > 0) {
        parseData["params"] = req.params;
      }
      if (Object.keys(parseData).length === 0) return next();

      const validate = await schema.parseAsync(parseData);
      req.body = validate.body;
      req.query = validate.query;
      req.params = validate.params;

      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export default validate;
