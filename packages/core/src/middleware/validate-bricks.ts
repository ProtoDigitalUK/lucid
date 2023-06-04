import z from "zod";
import { Request, Response, NextFunction } from "express";

// ------------------------------------
// Validate Middleware
const validateBricks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
        loop throw brick data and use BrickBuilder validation methods depending on the type. 

        Ie: text should use validateTextType.

        Build out error object in the same format as the validation errors and throw it.
    */

  try {
    return next();
  } catch (error) {
    return next(error);
  }
};

export default validateBricks;
