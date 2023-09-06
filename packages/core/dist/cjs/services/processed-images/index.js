"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clear_single_js_1 = __importDefault(require("./clear-single.js"));
const clear_all_js_1 = __importDefault(require("./clear-all.js"));
const process_image_js_1 = __importDefault(require("./process-image.js"));
const get_single_count_js_1 = __importDefault(require("./get-single-count.js"));
exports.default = {
    clearSingle: clear_single_js_1.default,
    clearAll: clear_all_js_1.default,
    processImage: process_image_js_1.default,
    getSingleCount: get_single_count_js_1.default,
};
//# sourceMappingURL=index.js.map