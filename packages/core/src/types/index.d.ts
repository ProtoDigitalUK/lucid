import { Request, Response } from "express";
import z from "zod";

declare global {
  // --------------------------------------------------
  // Controller
  type Controller<ParamsT, BodyT, QueryT> = (
    req: Request<z.infer<ParamsT>, any, z.infer<BodyT>, z.infer<QueryT>>,
    res: Response,
    next: (error: Error) => void
  ) => void;

  // --------------------------------------------------
  // Error Handling
  interface LucidErrorData {
    type: "validation" | "basic";

    name?: string;
    message?: string;
    status?: number;
    zod?: z.ZodError;
  }
  interface ErrorResult {
    code?: string;
    message?: string;
    children?: Array<undefined | ErrorResult>;
    [key: string]: Array<undefined | ErrorResult> | string | undefined;
  }
}
