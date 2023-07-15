"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const User_1 = __importDefault(require("../../db/models/User"));
const updateSingle = async (client, data) => {
    const [usernameCheck, emailCheck] = await Promise.all([
        data.username !== undefined
            ? User_1.default.getByUsername(client, { username: data.username })
            : Promise.resolve(undefined),
        data.email !== undefined
            ? User_1.default.getByEmail(client, { email: data.email })
            : Promise.resolve(undefined),
    ]);
    if (usernameCheck !== undefined || emailCheck !== undefined) {
        const errors = {};
        if (emailCheck) {
            errors.email = {
                code: "email_already_exists",
                message: "A user with that email already exists.",
            };
        }
        if (usernameCheck) {
            errors.username = {
                code: "username_already_exists",
                message: "A user with that username already exists.",
            };
        }
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email or username already exists.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)(errors),
        });
    }
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map