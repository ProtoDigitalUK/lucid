"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getSettingsQuery = zod_1.default.object({});
const getSettingsParams = zod_1.default.object({});
const getSettingsBody = zod_1.default.object({});
exports.default = {
    getSettings: {
        body: getSettingsBody,
        query: getSettingsQuery,
        params: getSettingsParams,
    },
};
//# sourceMappingURL=settings.js.map