"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const getSingle = async (data) => {
    const environment = await Environment_1.default.getSingle(data.key);
    return environment;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map