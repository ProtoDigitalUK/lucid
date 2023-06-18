"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const bricks_1 = require("./bricks");
const updateSingleBody = zod_1.default.object({
    bricks: zod_1.default.array(bricks_1.BrickSchema),
});
const updateSingleQuery = zod_1.default.object({});
const updateSingleParams = zod_1.default.object({
    collection_key: zod_1.default.string(),
});
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    collection_key: zod_1.default.string(),
});
exports.default = {
    updateSingle: {
        body: updateSingleBody,
        query: updateSingleQuery,
        params: updateSingleParams,
    },
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
};
//# sourceMappingURL=groups.js.map