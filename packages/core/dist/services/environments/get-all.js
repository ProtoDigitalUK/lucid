"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const format_environment_1 = __importDefault(require("../../utils/format/format-environment"));
const getAll = async () => {
    const environmentsRes = await Environment_1.default.getAll();
    return environmentsRes.map((environment) => (0, format_environment_1.default)(environment));
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map