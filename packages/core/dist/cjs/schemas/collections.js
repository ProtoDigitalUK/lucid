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
        type: zod_1.default.enum(["pages", "singlepage"]).optional(),
        environment_key: zod_1.default.string().optional(),
    })
        .optional(),
    include: zod_1.default.array(zod_1.default.enum(["bricks"])).optional(),
});
const getAllParams = zod_1.default.object({});
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    collection_key: zod_1.default.string(),
});
exports.default = {
    getAll: {
        body: getAllBody,
        query: getAllQuery,
        params: getAllParams,
    },
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
};
//# sourceMappingURL=collections.js.map