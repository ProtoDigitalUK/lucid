"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SinglePage_1 = __importDefault(require("../../db/models/SinglePage"));
const getSingle = async (data) => {
    const singlepage = await SinglePage_1.default.getSingle({
        environment_key: data.environment_key,
        collection_key: data.collection_key,
    });
    return singlepage;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map