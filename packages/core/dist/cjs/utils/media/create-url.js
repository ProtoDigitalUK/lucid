"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_js_1 = __importDefault(require("../../services/Config.js"));
const createURL = (key) => {
    if (!key) {
        return undefined;
    }
    return `${Config_js_1.default.host}/cdn/v1/${key}`;
};
exports.default = createURL;
//# sourceMappingURL=create-url.js.map