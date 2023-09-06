"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Role_js_1 = __importDefault(require("../../db/models/Role.js"));
const format_roles_js_1 = __importDefault(require("../../utils/format/format-roles.js"));
const deleteSingle = async (client, data) => {
    const role = await Role_js_1.default.deleteSingle(client, {
        id: data.id,
    });
    if (!role) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error deleting the role.",
            status: 500,
        });
    }
    return (0, format_roles_js_1.default)(role);
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map