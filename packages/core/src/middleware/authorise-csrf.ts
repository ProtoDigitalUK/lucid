import { Request, Response, NextFunction } from "express";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Services
import authService from "@services/auth/index.js";

const authoriseCSRF = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verifyCSRF = authService.csrf.verifyCSRFToken(req);
    if (!verifyCSRF) {
      throw new LucidError({
        type: "forbidden",
        code: "csrf",
        message: "You are not authorised to perform this action",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authoriseCSRF;
