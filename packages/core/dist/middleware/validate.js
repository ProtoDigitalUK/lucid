"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("@utils/error-handler");
const validate = (schema) => async (req, res, next) => {
    try {
        const parseData = {};
        parseData["body"] = req.body;
        parseData["query"] = req.query;
        parseData["params"] = req.params;
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