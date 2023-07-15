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
    password: zod_1.default.string().min(8),
});
const loginQuery = zod_1.default.object({});
const loginParams = zod_1.default.object({});
const logoutBody = zod_1.default.object({});
const logoutQuery = zod_1.default.object({});
const logoutParams = zod_1.default.object({});
const registerSuperAdminBody = zod_1.default.object({
    first_name: zod_1.default.string().optional(),
    last_name: zod_1.default.string().optional(),
    email: zod_1.default.string().email(),
    username: zod_1.default.string(),
    password: zod_1.default.string().min(8),
});
const registerSuperAdminQuery = zod_1.default.object({});
const registerSuperAdminParams = zod_1.default.object({});
const sendResetPasswordBody = zod_1.default.object({
    email: zod_1.default.string().email(),
});
const sendResetPasswordQuery = zod_1.default.object({});
const sendResetPasswordParams = zod_1.default.object({});
const verifyResetPasswordBody = zod_1.default.object({});
const verifyResetPasswordQuery = zod_1.default.object({});
const verifyResetPasswordParams = zod_1.default.object({
    token: zod_1.default.string(),
});
const resetPasswordBody = zod_1.default.object({
    password: zod_1.default.string().min(8),
});
const resetPasswordQuery = zod_1.default.object({});
const resetPasswordParams = zod_1.default.object({
    token: zod_1.default.string(),
});
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
    registerSuperAdmin: {
        body: registerSuperAdminBody,
        query: registerSuperAdminQuery,
        params: registerSuperAdminParams,
    },
    sendResetPassword: {
        body: sendResetPasswordBody,
        query: sendResetPasswordQuery,
        params: sendResetPasswordParams,
    },
    verifyResetPassword: {
        body: verifyResetPasswordBody,
        query: verifyResetPasswordQuery,
        params: verifyResetPasswordParams,
    },
    resetPassword: {
        body: resetPasswordBody,
        query: resetPasswordQuery,
        params: resetPasswordParams,
    },
};
//# sourceMappingURL=auth.js.map