import { Request, Response, NextFunction } from "express";
// Services
import { verifyJWT } from "@services/auth/jwt";
// Utils
import { LucidError } from "@utils/error-handler";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authenticateJWT = verifyJWT(req);
    if (!authenticateJWT.sucess || !authenticateJWT.data) {
      throw new LucidError({
        type: "authorisation",
        message: "You are not authorised to perform this action",
      });
    }

    req.auth = authenticateJWT.data;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authenticate;
