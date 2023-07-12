"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../services/Config"));
const createURL = (key) => {
    if (!key) {
        return undefined;
    }
    return `${Config_1.default.host}/api/media/${key}`;
};
exports.default = createURL;
//# sourceMappingURL=create-url.js.map