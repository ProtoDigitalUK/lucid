"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const deleteSingle = async (data) => {
    const environment = await Environment_1.default.deleteSingle(data.key);
    return environment;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map