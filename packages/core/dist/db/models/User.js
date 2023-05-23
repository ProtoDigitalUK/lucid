"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const db_1 = __importDefault(require("@db/db"));
const omit_undedefined_keys_1 = __importDefault(require("@utils/omit-undedefined-keys"));
const error_handler_1 = require("@utils/error-handler");
class User {
}
_a = User;
User.register = async (data) => {
    const { email, username, password, account_reset } = data;
    await User.checkIfUserExistsAlready(email, username);
    const hashedPassword = await argon2_1.default.hash(password);
    const updateData = (0, omit_undedefined_keys_1.default)({
        email,
        username,
        password: hashedPassword,
        account_reset,
    });
    const [user] = await (0, db_1.default) `
        INSERT INTO lucid_users
        ${(0, db_1.default)(updateData)}
        RETURNING *
        `;
    if (!user) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Created",
            message: "There was an error creating the user.",
            status: 500,
        });
    }
    delete user.password;
    return user;
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
    const updateData = (0, omit_undedefined_keys_1.default)({
        email,
        username,
        password: hashedPassword,
        account_reset: false,
    });
    const [updatedUser] = await (0, db_1.default) `
        UPDATE lucid_users
        SET
        ${(0, db_1.default)(updateData)}
        WHERE id = ${id}
        RETURNING *
        `;
    if (!updatedUser) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Updated",
            message: "There was an error updating the user.",
            status: 500,
        });
    }
    delete updatedUser.password;
    return updatedUser;
};
User.getById = async (id) => {
    const [user] = await (0, db_1.default) `
        SELECT * FROM lucid_users WHERE id = ${id}
        `;
    if (!user) {
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
    delete user.password;
    return user;
};
User.login = async (username, password) => {
    const [user] = await (0, db_1.default) `
        SELECT * FROM lucid_users WHERE username = ${username}
        `;
    if (!user || !user.password) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The email or password you entered is incorrect.",
            status: 500,
        });
    }
    const passwordValid = await argon2_1.default.verify(user.password, password);
    if (!passwordValid) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The email or password you entered is incorrect.",
            status: 500,
        });
    }
    delete user.password;
    return user;
};
User.checkIfUserExistsAlready = async (email, username) => {
    const [withEmail] = await (0, db_1.default) `
        SELECT * FROM lucid_users WHERE email = ${email}
        `;
    if (withEmail) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email already exists.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                email: {
                    code: "email_already_exists",
                    message: "A user with that email already exists.",
                },
            }),
        });
    }
    const [withUsername] = await (0, db_1.default) `
        SELECT * FROM lucid_users WHERE username = ${username}
        `;
    if (withUsername) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that username already exists.",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
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