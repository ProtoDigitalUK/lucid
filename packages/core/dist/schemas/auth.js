"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const getAuthenticatedUserBody = zod_1.default.object({});
const getAuthenticatedUserQuery = zod_1.default.object({});
const getAuthenticatedUserParams = zod_1.default.object({});
const getCSRFBody = zod_1.default.object({});
const getCSRFQuery = zod_1.default.object({});
const getCSRFParams = zod_1.default.object({});
const loginBody = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});
const loginQuery = zod_1.default.object({});
const loginParams = zod_1.default.object({});
const logoutBody = zod_1.default.object({});
const logoutQuery = zod_1.default.object({});
const logoutParams = zod_1.default.object({});
exports.default = {
    getAuthenticatedUser: {
        body: getAuthenticatedUserBody,
        query: getAuthenticatedUserQuery,
        params: getAuthenticatedUserParams,
    },
    getCSRF: {
        body: getCSRFBody,
        query: getCSRFQuery,
        params: getCSRFParams,
    },
    login: {
        body: loginBody,
        query: loginQuery,
        params: loginParams,
    },
    logout: {
        body: logoutBody,
        query: logoutQuery,
        params: logoutParams,
    },
};
//# sourceMappingURL=auth.js.map