"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_1 = __importDefault(require("./get-all"));
const get_single_1 = __importDefault(require("./get-single"));
const get_brick_config_1 = __importDefault(require("./get-brick-config"));
const is_brick_allowed_1 = __importDefault(require("./is-brick-allowed"));
const get_brick_data_1 = __importDefault(require("./get-brick-data"));
const get_all_allowed_bricks_1 = __importDefault(require("./get-all-allowed-bricks"));
exports.default = {
    getAll: get_all_1.default,
    getSingle: get_single_1.default,
    getBrickConfig: get_brick_config_1.default,
    isBrickAllowed: is_brick_allowed_1.default,
    getBrickData: get_brick_data_1.default,
    getAllAllowedBricks: get_all_allowed_bricks_1.default,
};
//# sourceMappingURL=index.js.map