"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const constants_1 = __importDefault(require("../constants"));
const error_handler_1 = require("../utils/app/error-handler");
const querySchema = zod_1.default.object({
    include: zod_1.default.string().optional(),
    exclude: zod_1.default.string().optional(),
    filter: zod_1.default.object({}).optional(),
    sort: zod_1.default.string().optional(),
    page: zod_1.default.string().optional(),
    per_page: zod_1.default.string().optional(),
});
const buildFilter = (query) => {
    let filter = undefined;
    Array.from(Object.entries(query.filter || {})).forEach(([key, value]) => {
        const v = value;
        if (!filter)
            filter = {};
        if (v.includes(",")) {
            filter[key] = v.split(",");
        }
        else {
            filter[key] = v;
        }
    });
    return filter;
};
const buildInclude = (query) => {
    let include = undefined;
    include = query.include?.split(",");
    return include;
};
const buildExclude = (query) => {
    let exclude = undefined;
    exclude = query.exclude?.split(",");
    return exclude;
};
const buildSort = (query) => {
    let sort = undefined;
    sort = query.sort?.split(",").map((sort) => {
        if (sort.startsWith("-")) {
            return {
                key: sort.slice(1),
                value: "desc",
            };
        }
        else {
            return {
                key: sort,
                value: "asc",
            };
        }
    });
    return sort;
};
const buildPage = (query) => {
    let page = undefined;
    if (query.page) {
        const pageInt = parseInt(query.page);
        if (!isNaN(pageInt)) {
            page = pageInt.toString();
        }
        else {
            page = "1";
        }
    }
    return page;
};
const buildPerPage = (query) => {
    let per_page = undefined;
    if (query.per_page) {
        const per_pageInt = parseInt(query.per_page);
        if (!isNaN(per_pageInt)) {
            per_page = per_pageInt.toString();
        }
        else {
            per_page = constants_1.default.pagination.per_page;
        }
    }
    return per_page;
};
const validate = (schema) => async (req, res, next) => {
    try {
        const parseData = {};
        parseData["body"] = req.body;
        parseData["params"] = req.params;
        parseData["query"] = {
            include: buildInclude(req.query),
            exclude: buildExclude(req.query),
            filter: buildFilter(req.query),
            sort: buildSort(req.query),
            page: buildPage(req.query),
            per_page: buildPerPage(req.query),
        };
        if (Object.keys(parseData).length === 0)
            return next();
        const validate = await schema.safeParseAsync(parseData);
        if (!validate.success) {
            throw new error_handler_1.LucidError({
                type: "validation",
                zod: validate.error,
            });
        }
        else {
            req.body = validate.data.body;
            req.query = validate.data.query;
            req.params = validate.data.params;
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = validate;
//# sourceMappingURL=validate.js.map