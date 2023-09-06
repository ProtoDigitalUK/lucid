"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const updateMeBody = zod_1.default.object({
    first_name: zod_1.default.string().optional(),
    last_name: zod_1.default.string().optional(),
    username: zod_1.default.string().min(3).optional(),
    email: zod_1.default.string().email().optional(),
    role_ids: zod_1.default.array(zod_1.default.number()).optional(),
});
const updateMeQuery = zod_1.default.object({});
const updateMeParams = zod_1.default.object({});
exports.default = {
    updateMe: {
        body: updateMeBody,
        query: updateMeQuery,
        params: updateMeParams,
    },
};
//# sourceMappingURL=account.js.map