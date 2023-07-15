"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const error_handler_1 = require("../../utils/app/error-handler");
const User_1 = __importDefault(require("../../db/models/User"));
const users_1 = __importDefault(require("../users"));
const format_user_1 = __importDefault(require("../../utils/format/format-user"));
const registerSingle = async (data, current_user_id) => {
    let superAdmin = data.super_admin;
    const checkUserProm = Promise.all([
        User_1.default.getByEmail({
            email: data.email,
        }),
        User_1.default.getByUsername({
            username: data.username,
        }),
    ]);
    const [userByEmail, userByUsername] = await checkUserProm;
    if (userByEmail || userByUsername) {
        const errors = {};
        if (userByEmail) {
            errors.email = {
                code: "email_already_exists",
                message: "A user with that email already exists.",
            };
        }
        if (userByUsername) {
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
    await users_1.default.checkIfUserExists({
        email: data.email,
        username: data.username,
    });
    if (current_user_id !== undefined) {
        const currentUser = await users_1.default.getSingle({
            user_id: current_user_id,
        });
        if (!currentUser.super_admin) {
            superAdmin = false;
        }
    }
    const hashedPassword = await argon2_1.default.hash(data.password);
    const user = await User_1.default.register({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        super_admin: superAdmin,
        first_name: data.first_name,
        last_name: data.last_name,
    });
    if (!user) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "User Not Created",
            message: "There was an error creating the user.",
            status: 500,
        });
    }
    try {
        if (data.role_ids && data.role_ids.length > 0) {
            await users_1.default.updateRoles({
                user_id: user.id,
                role_ids: data.role_ids,
            });
        }
    }
    catch (err) {
        await User_1.default.deleteSingle(user.id);
        throw err;
    }
    const userPermissions = await users_1.default.getPermissions({
        user_id: user.id,
    });
    return (0, format_user_1.default)(user, userPermissions);
};
exports.default = registerSingle;
//# sourceMappingURL=register-single.js.map