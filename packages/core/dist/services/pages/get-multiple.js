"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = __importDefault(require("../../db/models/Page"));
const getMultiple = async (data) => {
    const pages = await Page_1.default.getMultiple(data.query, {
        environment_key: data.environment_key,
    });
    return pages;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map