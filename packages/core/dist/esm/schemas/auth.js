import z from "zod";
const getAuthenticatedUserBody = z.object({});
const getAuthenticatedUserQuery = z.object({});
const getAuthenticatedUserParams = z.object({});
const getCSRFBody = z.object({});
const getCSRFQuery = z.object({});
const getCSRFParams = z.object({});
const loginBody = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
});
const loginQuery = z.object({});
const loginParams = z.object({});
const logoutBody = z.object({});
const logoutQuery = z.object({});
const logoutParams = z.object({});
const sendResetPasswordBody = z.object({
    email: z.string().email(),
});
const sendResetPasswordQuery = z.object({});
const sendResetPasswordParams = z.object({});
const verifyResetPasswordBody = z.object({});
const verifyResetPasswordQuery = z.object({});
const verifyResetPasswordParams = z.object({
    token: z.string(),
});
const resetPasswordBody = z
    .object({
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
})
    .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
});
const resetPasswordQuery = z.object({});
const resetPasswordParams = z.object({
    token: z.string(),
});
export default {
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