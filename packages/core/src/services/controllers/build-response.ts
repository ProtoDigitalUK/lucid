import { Request } from "express";

// --------------------------------------------------
// Types
interface BuildResponseParams {
  data: Array<any> | { [key: string]: any };
  pagination?: {
    count: number;
    page: string;
    per_page: string;
  };
}

type BuildResponseT = (
  req: Request,
  params: BuildResponseParams
) => ResponseBody;

// --------------------------------------------------
// Helpers
const getPath = (req: Request) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const originalUrl = req.originalUrl;

  return `${protocol}://${host}${originalUrl}`;
};
const buildPaginationMeta = (pagination: BuildResponseParams["pagination"]) => {
  if (!pagination) return undefined;

  return {
    current_page: pagination.page,
    last_page: Math.ceil(pagination.count / Number(pagination.per_page)),
    per_page: pagination.per_page,
    total: pagination.count,
  };
};

// --------------------------------------------------
// Main
const buildResponse: BuildResponseT = (req, params) => {
  let meta = {
    path: getPath(req),
    pagination: buildPaginationMeta(params.pagination),
  };
  let links = undefined;

  return {
    data: params.data,
    meta: meta,
    links,
  };
};

export default buildResponse;
