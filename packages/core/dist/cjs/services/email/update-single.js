"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Email_js_1 = __importDefault(require("../../db/models/Email.js"));
const updatteSingle = async (client, data) => {
    const email = await Email_js_1.default.updateSingle(client, {
        id: data.id,
        from_address: data.data.from_address,
        from_name: data.data.from_name,
        delivery_status: data.data.delivery_status,
    });
    if (!email) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Error updating email",
            message: "There was an error updating the email",
            status: 500,
        });
    }
    return email;
};
exports.default = updatteSingle;
//# sourceMappingURL=update-single.js.map