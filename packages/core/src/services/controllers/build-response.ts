import { Request } from "express";

// --------------------------------------------------
// Types
type BuildResponseT = (
  req: Request,
  props: {
    data: Array<any> | { [key: string]: any };
  }
) => ResponseBody;

// --------------------------------------------------
// Helpers
const getPath = (req: Request) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const originalUrl = req.originalUrl;

  return `${protocol}://${host}${originalUrl}`;
};

// --------------------------------------------------
// Main
const buildResponse: BuildResponseT = (req, params) => {
  let meta = {
    path: getPath(req),
  };
  let links = undefined;

  // TODO: once we get to a route that needs to be paginated, update props and logic here to add the correct meta and links

  return {
    data: params.data,
    meta: meta,
    links,
  };
};

export default buildResponse;
