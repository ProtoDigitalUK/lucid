import { Request } from "express";
// Services
import Config from "@services/Config";

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
  const originalUrl = req.originalUrl;
  return `${Config.host}${originalUrl}`.split("?")[0];
};

const buildMetaLinks = (
  req: Request,
  params: BuildResponseParams
): ResponseBody["meta"]["links"] => {
  const links: ResponseBody["meta"]["links"] = [];
  if (!params.pagination) return links;

  const { page, per_page, count } = params.pagination;
  const totalPages = Math.ceil(count / Number(per_page));

  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);

  for (let i = 0; i < totalPages; i++) {
    if (i !== 0) url.searchParams.set("page", String(i + 1));
    else url.searchParams.delete("page");
    links.push({
      active: page === String(i + 1),
      label: String(i + 1),
      url: url.toString(),
      page: i + 1,
    });
  }

  return links;
};
const buildLinks = (
  req: Request,
  params: BuildResponseParams
): ResponseBody["links"] => {
  if (!params.pagination) return undefined;

  const { page, per_page, count } = params.pagination;
  const totalPages = Math.ceil(count / Number(per_page));

  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);

  const links: ResponseBody["links"] = {
    first: null,
    last: null,
    next: null,
    prev: null,
  };

  // Set First
  url.searchParams.delete("page");
  links.first = url.toString();

  console.log(typeof page, typeof totalPages);

  // Set Last
  if (page !== String(totalPages))
    url.searchParams.set("page", String(totalPages));
  links.last = url.toString();

  // Set Next
  if (page !== String(totalPages)) {
    url.searchParams.set("page", String(Number(page) + 1));
    links.next = url.toString();
  } else {
    links.next = null;
  }

  // Set Prev
  if (page !== "1") {
    url.searchParams.set("page", String(Number(page) - 1));
    links.prev = url.toString();
  } else {
    links.prev = null;
  }

  return links;
};

// --------------------------------------------------
// Main
const buildResponse: BuildResponseT = (req, params) => {
  let meta = {
    path: getPath(req),
    links: buildMetaLinks(req, params),
    current_page: Number(params.pagination?.page) || null,
    per_page: Number(params.pagination?.per_page) || null,
    total: Number(params.pagination?.count) || null,
    last_page: params.pagination
      ? Math.ceil(
          params.pagination?.count / Number(params.pagination.per_page)
        ) ||
        Number(params.pagination?.page) ||
        null
      : null,
  };
  let links = buildLinks(req, params);

  return {
    data: params.data,
    meta: meta,
    links,
  };
};

export default buildResponse;
