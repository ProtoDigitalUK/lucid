"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getAllBody = zod_1.default.object({});
const getAllQuery = zod_1.default.object({
    filter: zod_1.default
        .object({
        type: zod_1.default.enum(["pages", "group"]).optional(),
        environment_key: zod_1.default.string().optional(),
    })
        .optional(),
});
const getAllParams = zod_1.default.object({});
exports.default = {
    getAll: {
        body: getAllBody,
        query: getAllQuery,
        params: getAllParams,
    },
};
//# sourceMappingURL=collections.js.map