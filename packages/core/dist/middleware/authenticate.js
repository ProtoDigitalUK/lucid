"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../services/auth/jwt");
const error_handler_1 = require("../utils/error-handler");
const authenticate = async (req, res, next) => {
    try {
        const authenticateJWT = (0, jwt_1.verifyJWT)(req);
        if (!authenticateJWT.sucess || !authenticateJWT.data) {
            throw new error_handler_1.LucidError({
                type: "authorisation",
                message: "You are not authorised to perform this action",
            });
        }
        req.auth = authenticateJWT.data;
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map