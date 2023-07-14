"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const users_1 = __importDefault(require("../users"));
const options_1 = __importDefault(require("../options"));
const registerSuperAdmin = async (data) => {
    const initialUserRes = await options_1.default.getByName({
        name: "initial_user_created",
    });
    const resValue = initialUserRes.option_value;
    if (resValue) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Initial User Already Created",
            message: "The initial super admin user has already been created.",
            status: 400,
        });
    }
    const user = await users_1.default.registerSingle({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        password: data.password,
        super_admin: true,
    });
    await options_1.default.patchByName({
        name: "initial_user_created",
        value: true,
        type: "boolean",
    });
    return user;
};
exports.default = registerSuperAdmin;
//# sourceMappingURL=register-superadmin.js.map