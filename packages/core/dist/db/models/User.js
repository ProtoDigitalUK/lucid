"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const db_1 = __importDefault(require("../db"));
const Option_1 = __importDefault(require("../models/Option"));
const error_handler_1 = require("../../utils/app/error-handler");
const query_helpers_1 = require("../../utils/app/query-helpers");
class User {
}
_a = User;
User.register = async (data) => {
    const client = await db_1.default;
    const { email, username, password, super_admin } = data;
    await User.checkIfUserExistsAlready(email, username);
    const hashedPassword = await argon2_1.default.hash(password);
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["email", "username", "password", "super_admin"],
        values: [email, username, hashedPassword, super_admin],
    });
    const user = await client.query({
        text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    if (!user.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Created",
            message: "There was an error creating the user.",
            status: 500,
        });
    }
    delete user.rows[0].password;
    return user.rows[0];
};
User.registerSuperAdmin = async (data) => {
    const user = await User.register({ ...data, super_admin: true });
    await Option_1.default.patchByName({
        name: "initial_user_created",
        value: true,
        type: "boolean",
    });
    return user;
};
User.getById = async (id) => {
    const client = await db_1.default;
    const user = await client.query({
        text: `SELECT * FROM lucid_users WHERE id = $1`,
        values: [id],
    });
    return user.rows[0];
};
User.login = async (data) => {
    const client = await db_1.default;
    const user = await client.query({
        text: `SELECT * FROM lucid_users WHERE username = $1`,
        values: [data.username],
    });
    return user.rows[0];
};
User.updateSingle = async (id, data) => {
    return {};
};
User.checkIfUserExistsAlready = async (email, username) => {
    const client = await db_1.default;
    const userExists = await client.query({
        text: `SELECT * FROM lucid_users WHERE email = $1 OR username = $2`,
        values: [email, username],
    });
    if (userExists.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email or username already exists.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
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
};
User.validatePassword = async (hashedPassword, password) => {
    return await argon2_1.default.verify(hashedPassword, password);
};
exports.default = User;
//# sourceMappingURL=User.js.map