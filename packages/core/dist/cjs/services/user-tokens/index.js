"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_single_js_1 = __importDefault(require("./create-single.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const delete_single_js_1 = __importDefault(require("./delete-single.js"));
exports.default = {
    createSingle: create_single_js_1.default,
    getSingle: get_single_js_1.default,
    deleteSingle: delete_single_js_1.default,
};
//# sourceMappingURL=index.js.map