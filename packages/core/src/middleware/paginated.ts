import { Request, Response, NextFunction } from "express";
import constants from "@root/constants";

const paginated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.query.page) {
      req.query.page = constants.pagination.page;
    }

    if (!req.query.per_page) {
      req.query.per_page = constants.pagination.per_page;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default paginated;
