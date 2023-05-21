import { Request, Response } from "express";
import z from "zod";

declare global {
  namespace Express {
    interface Request {
      auth: {
        id: string;
        email: string;
        username: string;
      };
    }
  }

  // --------------------------------------------------
  // Controller
  type Controller<ParamsT, BodyT, QueryT> = (
    req: Request<z.infer<ParamsT>, any, z.infer<BodyT>, z.infer<QueryT>>,
    res: Response,
    next: (error: Error) => void
  ) => void;
}
