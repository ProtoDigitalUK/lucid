"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Form_1 = __importDefault(require("../../db/models/Form"));
const getSingle = async (data) => {
    const form = await Form_1.default.getSingle({
        key: data.key,
        environment_key: data.environment_key,
    });
    return form;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map