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
    res: Response<ResponseBody>,
    next: (error: Error) => void
  ) => void;

  interface ResponseBody {
    data: Array<any> | { [key: string]: any };
    links?: {
      first: string;
      last: string;
      next: string;
      prev: string;
    };
    meta: {
      current_page?: number;
      from?: number;
      last_page?: number;
      links?: Array<{
        active: boolean;
        label: string;
        url: string | null;
      }>;
      path: string;
      per_page?: number;
      to?: number;
      total?: number;
    };
  }

  // --------------------------------------------------
  // Model
  interface ModelQueryParams {
    include?: Array<string>;
    exclude?: Array<string>;
    filter?: {
      [key: string]: string | Array<string>;
    };
    sort?: Array<{
      key: string;
      value: "asc" | "desc";
    }>;
    page?: string;
    per_page?: string;
  }
}
