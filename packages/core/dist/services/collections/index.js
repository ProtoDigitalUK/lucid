"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_single_1 = __importDefault(require("./get-single"));
const get_all_1 = __importDefault(require("./get-all"));
const update_bricks_1 = __importDefault(require("./update-bricks"));
const format_collection_1 = __importDefault(require("./format-collection"));
exports.default = {
    getSingle: get_single_1.default,
    getAll: get_all_1.default,
    updateBricks: update_bricks_1.default,
    formatCollection: format_collection_1.default,
};
//# sourceMappingURL=index.js.map