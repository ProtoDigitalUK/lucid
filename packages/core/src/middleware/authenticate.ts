import { Request, Response, NextFunction } from "express";
// Utils
import { LucidError } from "@utils/app/error-handler";
// Services
import authService from "@services/auth";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authenticateJWT = authService.jwt.verifyJWT(req);
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
