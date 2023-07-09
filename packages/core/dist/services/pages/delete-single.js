"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = __importDefault(require("../../db/models/Page"));
const deleteSingle = async (data) => {
    const page = await Page_1.default.deleteSingle({
        id: data.id,
        environment_key: data.environment_key,
    });
    return page;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map