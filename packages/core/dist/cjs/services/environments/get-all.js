"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_js_1 = __importDefault(require("../../db/models/Environment.js"));
const format_environment_js_1 = __importDefault(require("../../utils/format/format-environment.js"));
const getAll = async (client) => {
    const environmentsRes = await Environment_js_1.default.getAll(client);
    return environmentsRes.map((environment) => (0, format_environment_js_1.default)(environment));
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map