"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csrf_1 = require("../services/auth/csrf");
const error_handler_1 = require("../utils/app/error-handler");
const authoriseCSRF = async (req, res, next) => {
    try {
        const verifyCSRF = (0, csrf_1.verifyCSRFToken)(req);
        if (!verifyCSRF) {
            throw new error_handler_1.LucidError({
                type: "forbidden",
                code: "csrf",
                message: "You are not authorised to perform this action",
            });
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = authoriseCSRF;
//# sourceMappingURL=authorise-csrf.js.map