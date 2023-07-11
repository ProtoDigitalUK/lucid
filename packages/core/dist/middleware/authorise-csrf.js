"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../utils/app/error-handler");
const auth_1 = __importDefault(require("../services/auth"));
const authoriseCSRF = async (req, res, next) => {
    try {
        const verifyCSRF = auth_1.default.csrf.verifyCSRFToken(req);
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