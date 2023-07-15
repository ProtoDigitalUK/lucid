import z from "zod";

// ------------------------------------
// UPDATE SINGLE
const updateSingleBody = z.object({});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({});

// ------------------------------------
// UPDATE ROLES
const updateRolesBody = z.object({
  role_ids: z.array(z.number()),
});
const updateRolesQuery = z.object({});
const updateRolesParams = z.object({
  id: z.string(),
});

// ------------------------------------
// CREATE USER
const createUserBody = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(8),
  role_ids: z.array(z.number()),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  super_admin: z.boolean().optional(),
});
const createUserQuery = z.object({});
const createUserParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams,
  },
  updateRoles: {
    body: updateRolesBody,
    query: updateRolesQuery,
    params: updateRolesParams,
  },
  createUser: {
    body: createUserBody,
    query: createUserQuery,
    params: createUserParams,
  },
};
