"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = void 0;
const getLocation = (req) => {
    return `${req.protocol}://${req.get("host")}`;
};
exports.getLocation = getLocation;
const getPath = (req) => {
    const originalUrl = req.originalUrl;
    return `${(0, exports.getLocation)(req)}${originalUrl}`.split("?")[0];
};
const buildMetaLinks = (req, params) => {
    const links = [];
    if (!params.pagination)
        return links;
    const { page, per_page, count } = params.pagination;
    const totalPages = Math.ceil(count / Number(per_page));
    const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
    for (let i = 0; i < totalPages; i++) {
        if (i !== 0)
            url.searchParams.set("page", String(i + 1));
        else
            url.searchParams.delete("page");
        links.push({
            active: page === String(i + 1),
            label: String(i + 1),
            url: url.toString(),
            page: i + 1,
        });
    }
    return links;
};
const buildLinks = (req, params) => {
    if (!params.pagination)
        return undefined;
    const { page, per_page, count } = params.pagination;
    const totalPages = Math.ceil(count / Number(per_page));
    const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
    const links = {
        first: null,
        last: null,
        next: null,
        prev: null,
    };
    if (parseInt(count) === 0) {
        return links;
    }
    url.searchParams.delete("page");
    links.first = url.toString();
    if (page !== String(totalPages))
        url.searchParams.set("page", String(totalPages));
    links.last = url.toString();
    if (page !== String(totalPages)) {
        url.searchParams.set("page", String(Number(page) + 1));
        links.next = url.toString();
    }
    else {
        links.next = null;
    }
    if (page !== "1") {
        url.searchParams.set("page", String(Number(page) - 1));
        links.prev = url.toString();
    }
    else {
        links.prev = null;
    }
    return links;
};
const buildResponse = (req, params) => {
    let meta = {
        path: getPath(req),
        links: buildMetaLinks(req, params),
        current_page: Number(params.pagination?.page) || null,
        per_page: Number(params.pagination?.per_page) || null,
        total: Number(params.pagination?.count) || null,
        last_page: params.pagination
            ? Math.ceil(params.pagination?.count / Number(params.pagination.per_page)) ||
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
exports.default = buildResponse;
//# sourceMappingURL=build-response.js.map