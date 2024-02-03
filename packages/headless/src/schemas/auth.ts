import z from "zod";

// Get authenticated user
const getAuthenticatedUserBody = z.object({});
const getAuthenticatedUserQuery = z.object({});
const getAuthenticatedUserParams = z.object({});

// CSRF
const getCSRFBody = z.object({});
const getCSRFQuery = z.object({});
const getCSRFParams = z.object({});

// Login
const loginBody = z.object({
    usernameOrEmail: z.string().min(3),
    password: z.string().min(8),
});
const loginQuery = z.object({});
const loginParams = z.object({});

// Export
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
};
