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
const createSingleBody = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(8),
  role_ids: z.array(z.number()),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  super_admin: z.boolean().optional(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// DELETE SINGLE
const deleteSingleBody = z.object({});
const deleteSingleQuery = z.object({});
const deleteSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// GET MULTIPLE
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
  filter: z
    .object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      email: z.string().optional(),
      username: z.string().optional(),
    })
    .optional(),
  sort: z
    .array(
      z.object({
        key: z.enum(["created_at"]),
        value: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const getMultipleParams = z.object({});

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
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams,
  },
  getMultiple: {
    body: getMultipleBody,
    query: getMultipleQuery,
    params: getMultipleParams,
  },
};
