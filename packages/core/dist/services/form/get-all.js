"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Form_1 = __importDefault(require("../../db/models/Form"));
const getAll = async (data) => {
    const forms = await Form_1.default.getAll(data.query, data.environment_key);
    return forms;
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map