"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clear_single_1 = __importDefault(require("./clear-single"));
const clear_all_1 = __importDefault(require("./clear-all"));
const process_image_1 = __importDefault(require("./process-image"));
const get_single_count_1 = __importDefault(require("./get-single-count"));
exports.default = {
    clearSingle: clear_single_1.default,
    clearAll: clear_all_1.default,
    processImage: process_image_1.default,
    getSingleCount: get_single_count_1.default,
};
//# sourceMappingURL=index.js.map