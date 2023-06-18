import z from "zod";

// ------------------------------------
// GET ALL
const getAllBody = z.object({});
const getAllQuery = z.object({});
const getAllParams = z.object({});

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  key: z.string(),
});

// ------------------------------------
// MIGRATE ENVIRONMENT
const migrateEnvironmentBody = z.object({});
const migrateEnvironmentQuery = z.object({});
const migrateEnvironmentParams = z.object({
  key: z.string(),
});

// ------------------------------------
// UPDATE SINGLE
const updateSingleBody = z.object({
  assigned_bricks: z.array(z.string()).optional(),
  assigned_collections: z.array(z.string()).optional(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
  key: z.string(),
});

// ------------------------------------
// EXPORT
export default {
  getAll: {
    body: getAllBody,
    query: getAllQuery,
    params: getAllParams,
  },
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery,
    params: getSingleParams,
  },
  migrateEnvironment: {
    body: migrateEnvironmentBody,
    query: migrateEnvironmentQuery,
    params: migrateEnvironmentParams,
  },
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams,
  },
};
