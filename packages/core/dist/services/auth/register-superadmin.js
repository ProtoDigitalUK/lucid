"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const User_1 = __importDefault(require("../../db/models/User"));
const Option_1 = __importDefault(require("../../db/models/Option"));
const registerSuperAdmin = async (data) => {
    const initialUserRes = await Option_1.default.getByName("initial_user_created");
    const resValue = initialUserRes.option_value;
    if (resValue) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Initial User Already Created",
            message: "The initial super admin user has already been created.",
            status: 400,
        });
    }
    const user = await User_1.default.registerSuperAdmin({
        email: data.email,
        username: data.username,
        password: data.password,
    });
    return user;
};
exports.default = registerSuperAdmin;
//# sourceMappingURL=register-superadmin.js.map