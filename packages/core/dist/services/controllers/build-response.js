"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPath = (req) => {
    const protocol = req.protocol;
    const host = req.get("host");
    const originalUrl = req.originalUrl;
    return `${protocol}://${host}${originalUrl}`;
};
const buildPaginationMeta = (pagination) => {
    if (!pagination)
        return undefined;
    return {
        current_page: pagination.page,
        last_page: Math.ceil(pagination.count / Number(pagination.per_page)),
        per_page: pagination.per_page,
        total: pagination.count,
    };
};
const buildResponse = (req, params) => {
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
exports.default = buildResponse;
//# sourceMappingURL=build-response.js.map