"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getHealthBody = zod_1.default.object({});
const getHealthQuery = zod_1.default.object({});
const getHealthParams = zod_1.default.object({});
exports.default = {
    getHealth: {
        body: getHealthBody,
        query: getHealthQuery,
        params: getHealthParams,
    },
};
//# sourceMappingURL=health.js.map