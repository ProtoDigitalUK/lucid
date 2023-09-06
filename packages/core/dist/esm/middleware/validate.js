import z from "zod";
import constants from "../constants.js";
import { LucidError } from "../utils/app/error-handler.js";
const querySchema = z.object({
    include: z.string().optional(),
    exclude: z.string().optional(),
    filter: z.object({}).optional(),
    sort: z.string().optional(),
    page: z.string().optional(),
    per_page: z.string().optional(),
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
            per_page = constants.pagination.perPage;
        }
    }
    return per_page;
};
const addRemainingQuery = (req) => {
    const remainingQuery = Object.fromEntries(Object.entries(req.query).filter(([key]) => !["include", "exclude", "filter", "sort", "page", "per_page"].includes(key)));
    return remainingQuery;
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
            ...addRemainingQuery(req),
        };
        if (Object.keys(parseData).length === 0)
            return next();
        const validate = await schema.safeParseAsync(parseData);
        if (!validate.success) {
            throw new LucidError({
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
export default validate;
//# sourceMappingURL=validate.js.map