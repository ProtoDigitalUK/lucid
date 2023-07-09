"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = __importDefault(require("../../db/models/Collection"));
const getAll = async (data) => {
    const collections = await Collection_1.default.getAll(data.query, data.environment_key);
    return collections;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map