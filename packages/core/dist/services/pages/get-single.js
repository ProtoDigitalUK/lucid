"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = __importDefault(require("../../db/models/Page"));
const getSingle = async (data) => {
    const page = await Page_1.default.getSingle(data.query, {
        environment_key: data.environment_key,
        id: data.id,
    });
    return page;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map