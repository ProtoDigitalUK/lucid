"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const upsertSingle = async (data) => {
    const environment = await Environment_1.default.upsertSingle(data.data, data.create);
    return environment;
};
exports.default = upsertSingle;
//# sourceMappingURL=upsert-single.js.map