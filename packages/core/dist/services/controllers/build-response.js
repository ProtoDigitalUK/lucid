"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPath = (req) => {
    const protocol = req.protocol;
    const host = req.get("host");
    const originalUrl = req.originalUrl;
    return `${protocol}://${host}${originalUrl}`;
};
const buildResponse = (req, params) => {
    let meta = {
        path: getPath(req),
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