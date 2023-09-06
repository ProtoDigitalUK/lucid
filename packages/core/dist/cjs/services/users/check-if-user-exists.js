"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../users/index.js"));
const checkIfUserExists = async (client, data) => {
    const user = await (0, service_js_1.default)(index_js_1.default.getSingleQuery, false, client)({
        email: data.email,
        username: data.username,
    });
    if (user) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email or username already exists.",
            status: 400,
            errors: (0, error_handler_js_1.modelErrors)({
                email: {
                    code: "email_already_exists",
                    message: "A user with that email already exists.",
                },
                username: {
                    code: "username_already_exists",
                    message: "A user with that username already exists.",
                },
            }),
        });
    }
    return user;
};
exports.default = checkIfUserExists;
//# sourceMappingURL=check-if-user-exists.js.map