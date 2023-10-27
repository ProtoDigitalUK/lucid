import z from "zod";

// ------------------------------------
// CREATE SINGLE
const createSingleBody = z.object({
  code: z.string().min(3).max(3), // ISO 639-3
  is_default: z.boolean().optional(),
  is_enabled: z.boolean().optional(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  code: z.string().min(3).max(3), // ISO 639-3
});

// ------------------------------------
// GET MULTIPLE
const getMultipleQuery = z.object({
  sort: z
    .array(
      z.object({
        key: z.enum(["created_at", "code", "updated_at"]),
        value: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const getMultipleParams = z.object({});
const getMultipleBody = z.object({});

// ------------------------------------
// EXPORT
export default {
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
  getSingle: {
    query: getSingleQuery,
    params: getSingleParams,
    body: getSingleBody,
  },
  getMultiple: {
    query: getMultipleQuery,
    params: getMultipleParams,
    body: getMultipleBody,
  },
};
