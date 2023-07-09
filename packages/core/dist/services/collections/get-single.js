"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = __importDefault(require("../../db/models/Collection"));
const getSingle = async (data) => {
    const collections = await Collection_1.default.getSingle({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
    });
    return collections;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map