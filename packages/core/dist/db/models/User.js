"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
class User {
}
_a = User;
User.register = async (data) => {
    const { email, username, password, account_reset } = data;
    await User.checkIfUserExistsAlready(email, username);
    const hashedPassword = await argon2_1.default.hash(password);
    const user = await db_1.default.query({
        text: `INSERT INTO lucid_users (email, username, password, account_reset) VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [email, username, hashedPassword, account_reset || false],
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
User.accountReset = async (id, data) => {
    const { email, username, password } = data;
    const user = await User.getById(id);
    if (!user.account_reset) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Account Reset Not Allowed",
            message: "Account reset is not allowed for this user.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                account_reset: {
                    code: "account_reset_not_allowed",
                    message: "Account reset is not allowed for this user.",
                },
            }),
        });
    }
    const hashedPassword = await argon2_1.default.hash(password);
    const updatedUser = await db_1.default.query({
        text: `UPDATE lucid_users SET email = $1, username = $2, password = $3, account_reset = $4 WHERE id = $5 RETURNING *`,
        values: [email, username, hashedPassword, false, id],
    });
    if (!updatedUser.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Updated",
            message: "There was an error updating the user.",
            status: 500,
        });
    }
    delete updatedUser.rows[0].password;
    return updatedUser.rows[0];
};
User.getById = async (id) => {
    const user = await db_1.default.query({
        text: `SELECT * FROM lucid_users WHERE id = $1`,
        values: [id],
    });
    if (!user.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "There was an error finding the user.",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                id: {
                    code: "user_not_found",
                    message: "There was an error finding the user.",
                },
            }),
        });
    }
    delete user.rows[0].password;
    return user.rows[0];
};
User.login = async (username, password) => {
    const user = await db_1.default.query({
        text: `SELECT * FROM lucid_users WHERE username = $1`,
        values: [username],
    });
    if (!user.rows[0] || !user.rows[0].password) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The email or password you entered is incorrect.",
            status: 500,
        });
    }
    const passwordValid = await argon2_1.default.verify(user.rows[0].password, password);
    if (!passwordValid) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The email or password you entered is incorrect.",
            status: 500,
        });
    }
    delete user.rows[0].password;
    return user.rows[0];
};
User.checkIfUserExistsAlready = async (email, username) => {
    const userExists = await db_1.default.query({
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
exports.default = User;
//# sourceMappingURL=User.js.map