"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../utils/error-handler");
const permissions = (permissions) => async (req, res, next) => {
    try {
        const environment = req.headers["lucid-environment"];
        if (!environment) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Validation Error",
                message: "You must set the Lucid Environment header.",
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    "lucid-environment": {
                        code: "required",
                        message: "You must set the Lucid Environment header.",
                    },
                }),
            });
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = permissions;
//# sourceMappingURL=permissions.js.map