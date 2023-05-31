"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db/db"));
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
        const user = await db_1.default.query({
            text: `SELECT id FROM lucid_users WHERE id = $1`,
            values: [authenticateJWT.data.id],
        });
        if (!user.rows[0]) {
            (0, jwt_1.clearJWT)(res);
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