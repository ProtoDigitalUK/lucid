"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_multiple_js_1 = __importDefault(require("./create-multiple.js"));
const delete_multiple_js_1 = __importDefault(require("./delete-multiple.js"));
const delete_all_js_1 = __importDefault(require("./delete-all.js"));
const get_all_js_1 = __importDefault(require("./get-all.js"));
exports.default = {
    createMultiple: create_multiple_js_1.default,
    deleteMultiple: delete_multiple_js_1.default,
    deleteAll: delete_all_js_1.default,
    getAll: get_all_js_1.default,
};
//# sourceMappingURL=index.js.map