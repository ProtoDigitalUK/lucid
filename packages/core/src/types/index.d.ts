import { Request, Response, Express } from "express";
import z from "zod";

declare global {
  namespace Express {
    interface Request {
      auth: {
        id: number;
        email: string;
        username: string;
      };
    }
  }

  interface InitConfig {
    origin: string;
    express: Express;
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
      first: string | null;
      last: string | null;
      next: string | null;
      prev: string | null;
    };
    meta: {
      links?: Array<{
        active: boolean;
        label: string;
        url: string | null;
        page: number;
      }>;
      path: string;

      current_page?: number | null;
      last_page?: number | null;
      per_page?: number | null;
      total?: number | null;
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
