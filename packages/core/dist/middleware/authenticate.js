"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../utils/app/error-handler");
const auth_1 = __importDefault(require("../services/auth"));
const authenticate = async (req, res, next) => {
    try {
        const authenticateJWT = auth_1.default.jwt.verifyJWT(req);
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