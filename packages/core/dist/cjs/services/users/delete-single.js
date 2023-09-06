"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const User_js_1 = __importDefault(require("../../db/models/User.js"));
const index_js_1 = __importDefault(require("../users/index.js"));
const format_user_js_1 = __importDefault(require("../../utils/format/format-user.js"));
const deleteSingle = async (client, data) => {
    await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        user_id: data.user_id,
    });
    const user = await User_js_1.default.deleteSingle(client, {
        id: data.user_id,
    });
    if (!user) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "User Not Deleted",
            message: "The user was not deleted",
            status: 500,
        });
    }
    return (0, format_user_js_1.default)(user);
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map