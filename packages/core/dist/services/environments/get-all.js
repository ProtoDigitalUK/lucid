"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const getAll = async (data) => {
    const environments = await Environment_1.default.getAll();
    return environments;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map