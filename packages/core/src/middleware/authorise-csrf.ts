import { Request, Response, NextFunction } from "express";
// Utils
import { verifyCSRFToken } from "@services/auth/csrf";
import { LucidError } from "@utils/app/error-handler";

const authoriseCSRF = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verifyCSRF = verifyCSRFToken(req);
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
