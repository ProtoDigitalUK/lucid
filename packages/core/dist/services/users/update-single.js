"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const User_1 = __importDefault(require("../../db/models/User"));
const users_1 = __importDefault(require("../users"));
const updateSingle = async (client, data) => {
    const user = await (0, service_1.default)(users_1.default.getSingle, false, client)({
        user_id: data.user_id,
    });
    if (data.first_name !== undefined && data.first_name === user.first_name)
        delete data.first_name;
    if (data.last_name !== undefined && data.last_name === user.last_name)
        delete data.last_name;
    if (data.username !== undefined && data.username === user.username)
        delete data.username;
    if (data.email !== undefined && data.email === user.email)
        delete data.email;
    const [usernameCheck, emailCheck] = await Promise.all([
        data.username !== undefined
            ? (0, service_1.default)(users_1.default.getSingleQuery, false, client)({
                username: data.username,
            })
            : Promise.resolve(undefined),
        data.email !== undefined
            ? (0, service_1.default)(users_1.default.getSingleQuery, false, client)({
                email: data.email,
            })
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
    let hashedPassword = undefined;
    if (data.password) {
        hashedPassword = await argon2_1.default.hash(data.password);
    }
    const userUpdate = await User_1.default.updateSingle(client, {
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
    });
    if (!userUpdate) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Updated",
            message: "The user was not updated.",
            status: 500,
        });
    }
    if (data.role_ids) {
        await (0, service_1.default)(users_1.default.updateRoles, false, client)({
            user_id: data.user_id,
            role_ids: data.role_ids,
        });
    }
    return await (0, service_1.default)(users_1.default.getSingle, false, client)({
        user_id: data.user_id,
    });
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map