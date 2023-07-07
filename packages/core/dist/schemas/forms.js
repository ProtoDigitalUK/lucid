"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getSingleBody = zod_1.default.object({});
const getSingleQuery = zod_1.default.object({});
const getSingleParams = zod_1.default.object({
    form_key: zod_1.default.string(),
});
const getAllBody = zod_1.default.object({});
const getAllQuery = zod_1.default.object({
    include: zod_1.default.array(zod_1.default.enum(["fields"])).optional(),
});
const getAllParams = zod_1.default.object({});
exports.default = {
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
    getAll: {
        body: getAllBody,
        query: getAllQuery,
        params: getAllParams,
    },
};
//# sourceMappingURL=forms.js.map