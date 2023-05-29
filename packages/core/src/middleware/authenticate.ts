import { Request, Response, NextFunction } from "express";
import client from "@db/db";
// Services
import { verifyJWT, clearJWT } from "@services/auth/jwt";
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

    const user = await client.query({
      text: `SELECT * FROM lucid_users WHERE id = $1`,
      values: [authenticateJWT.data.id],
    });

    if (!user.rows[0]) {
      // clear cookie
      clearJWT(res);
      // throw error
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
