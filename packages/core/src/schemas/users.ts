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
};
