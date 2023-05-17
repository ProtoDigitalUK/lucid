import { Request, Response } from "express";
import z from "zod";

declare global {
  interface Error {
    status?: number;
  }

  type Controller<ParamsT, BodyT, QueryT> = (
    req: Request<z.infer<ParamsT>, any, z.infer<BodyT>, z.infer<QueryT>>,
    res: Response
  ) => void;
}
