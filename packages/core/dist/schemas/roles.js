"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const createSingleBody = zod_1.default.object({
    name: zod_1.default.string().min(2),
    permission_groups: zod_1.default.array(zod_1.default.object({
        environment_key: zod_1.default.string().optional(),
        permissions: zod_1.default.array(zod_1.default.string()),
    })),
});
const createSingleQuery = zod_1.default.object({});
const createSingleParams = zod_1.default.object({});
exports.default = {
    createSingle: {
        body: createSingleBody,
        query: createSingleQuery,
        params: createSingleParams,
    },
};
//# sourceMappingURL=roles.js.map