import z from "zod";

// ------------------------------------
// CREATE SINGLE
const createSingleBody = z.object({
  name: z.string().min(2),
  permission_groups: z.array(
    z.object({
      environment_key: z.string().optional(),
      permissions: z.array(z.string()),
    })
  ),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// UPDATE SINGLE
const updateSingleBody = z.object({
  name: z.string().min(2),
  permission_groups: z.array(
    z.object({
      environment_key: z.string().optional(),
      permissions: z.array(z.string()),
    })
  ),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// DELETE SINGLE
const deleteSingleBody = z.object({});
const deleteSingleQuery = z.object({});
const deleteSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// EXPORT
export default {
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams,
  },
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams,
  },
};
