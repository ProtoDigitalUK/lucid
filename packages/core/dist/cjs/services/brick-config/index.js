"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_js_1 = __importDefault(require("./get-all.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const get_brick_config_js_1 = __importDefault(require("./get-brick-config.js"));
const is_brick_allowed_js_1 = __importDefault(require("./is-brick-allowed.js"));
const get_brick_data_js_1 = __importDefault(require("./get-brick-data.js"));
const get_all_allowed_bricks_js_1 = __importDefault(require("./get-all-allowed-bricks.js"));
exports.default = {
    getAll: get_all_js_1.default,
    getSingle: get_single_js_1.default,
    getBrickConfig: get_brick_config_js_1.default,
    isBrickAllowed: is_brick_allowed_js_1.default,
    getBrickData: get_brick_data_js_1.default,
    getAllAllowedBricks: get_all_allowed_bricks_js_1.default,
};
//# sourceMappingURL=index.js.map