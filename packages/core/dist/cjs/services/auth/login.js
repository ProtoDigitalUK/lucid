"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../auth/index.js"));
const index_js_2 = __importDefault(require("../users/index.js"));
const login = async (client, data) => {
    const user = await (0, service_js_1.default)(index_js_2.default.getSingleQuery, false, client)({
        username: data.username,
    });
    if (!user || !user.password) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The username or password you entered is incorrect.",
            status: 500,
        });
    }
    const passwordValid = await index_js_1.default.validatePassword({
        hashedPassword: user.password,
        password: data.password,
    });
    if (!passwordValid) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The username or password you entered is incorrect.",
            status: 500,
        });
    }
    return await (0, service_js_1.default)(index_js_2.default.getSingle, false, client)({
        user_id: user.id,
    });
};
exports.default = login;
//# sourceMappingURL=login.js.map