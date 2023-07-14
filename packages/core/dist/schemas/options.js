"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getSinglePublicBody = zod_1.default.object({});
const getSinglePublicQuery = zod_1.default.object({});
const getSinglePublicParams = zod_1.default.object({
    name: zod_1.default.string().regex(/^(initial_user_created)$/),
});
exports.default = {
    getSinglePublic: {
        body: getSinglePublicBody,
        query: getSinglePublicQuery,
        params: getSinglePublicParams,
    },
};
//# sourceMappingURL=options.js.map