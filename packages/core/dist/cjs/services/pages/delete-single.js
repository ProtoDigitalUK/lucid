"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Page_js_1 = __importDefault(require("../../db/models/Page.js"));
const index_js_1 = __importDefault(require("../pages/index.js"));
const format_page_js_1 = __importDefault(require("../../utils/format/format-page.js"));
const deleteSingle = async (client, data) => {
    await (0, service_js_1.default)(index_js_1.default.checkPageExists, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
    const page = await Page_js_1.default.deleteSingle(client, {
        id: data.id,
    });
    if (!page) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Page Not Deleted",
            message: "There was an error deleting the page",
            status: 500,
        });
    }
    return (0, format_page_js_1.default)(page);
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map