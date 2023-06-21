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
// GET MULTIPLE
const getMultipleQuery = z.object({
  filter: z
    .object({
      name: z.string().optional(),
      role_ids: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
  sort: z
    .array(
      z.object({
        key: z.enum(["created_at", "name"]),
        value: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  include: z.array(z.enum(["permissions"])).optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const getMultipleParams = z.object({});
const getMultipleBody = z.object({});

// ------------------------------------
// GET SINGLE
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  id: z.string(),
});
const getSingleBody = z.object({});

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
  getMultiple: {
    body: getMultipleBody,
    query: getMultipleQuery,
    params: getMultipleParams,
  },
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery,
    params: getSingleParams,
  },
};
