import z from "zod";

// ------------------------------------
// GET AUTHENTICATED USER
const getAuthenticatedUserBody = z.object({});
const getAuthenticatedUserQuery = z.object({});
const getAuthenticatedUserParams = z.object({});

// ------------------------------------
// GET CSRF
const getCSRFBody = z.object({});
const getCSRFQuery = z.object({});
const getCSRFParams = z.object({});

// ------------------------------------
// LOGIN
const loginBody = z.object({
  username: z.string(),
  password: z.string(),
});
const loginQuery = z.object({});
const loginParams = z.object({});

// ------------------------------------
// LOGOUT
const logoutBody = z.object({});
const logoutQuery = z.object({});
const logoutParams = z.object({});

// ------------------------------------
// REGISTER SUPER ADMIN
const registerSuperAdminBody = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(8),
});
const registerSuperAdminQuery = z.object({});
const registerSuperAdminParams = z.object({});

// ------------------------------------
// EXPORT
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
  registerSuperAdmin: {
    body: registerSuperAdminBody,
    query: registerSuperAdminQuery,
    params: registerSuperAdminParams,
  },
};
