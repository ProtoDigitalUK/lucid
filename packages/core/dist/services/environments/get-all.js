"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const environments_1 = __importDefault(require("../environments"));
const getAll = async () => {
    const environmentsRes = await Environment_1.default.getAll();
    return environmentsRes.map((environment) => environments_1.default.format(environment));
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map