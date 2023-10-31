import z from "zod";

export const mediaTranslations = z.array(
  z.object({
    language_id: z.number(),
    name: z.string().optional(),
    alt: z.string().optional(),
  })
);

// ------------------------------------
// CREATE SINGLE
const createSingleBody = z.object({
  translations: z.string(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// STREAM SINGLE
const streamSingleBody = z.object({});
const streamSingleQuery = z.object({
  width: z.string().optional(),
  height: z.string().optional(),
  format: z.enum(["jpeg", "png", "webp", "avif"]).optional(),
  quality: z.string().optional(),
  fallback: z.enum(["1", "0"]).optional(),
});
const streamSingleParams = z.object({
  key: z.string(),
});

// ------------------------------------
// GET MULTIPLE
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
  filter: z
    .object({
      name: z.string().optional(),
      key: z.string().optional(),
      mime_type: z.union([z.string(), z.array(z.string())]).optional(),
      type: z.union([z.string(), z.array(z.string())]).optional(),
      file_extension: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
  sort: z
    .array(
      z.object({
        key: z.enum([
          "created_at",
          "updated_at",
          "name",
          "file_size",
          "width",
          "height",
          "mime_type",
          "file_extension",
        ]),
        value: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const getMultipleParams = z.object({});

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
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
// UPDATE SINGLE
const updateSingleBody = z.object({
  translations: z.string(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// CLEAR SINGLE PROCESSED IMAGES
const clearSingleProcessedBody = z.object({});
const clearSingleProcessedQuery = z.object({});
const clearSingleProcessedParams = z.object({
  id: z.string(),
});

// ------------------------------------
// CLEAR ALL PROCESSED IMAGES
const clearAllProcessedBody = z.object({});
const clearAllProcessedQuery = z.object({});
const clearAllProcessedParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
  streamSingle: {
    body: streamSingleBody,
    query: streamSingleQuery,
    params: streamSingleParams,
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
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams,
  },
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams,
  },
  clearSingleProcessed: {
    body: clearSingleProcessedBody,
    query: clearSingleProcessedQuery,
    params: clearSingleProcessedParams,
  },
  clearAllProcessed: {
    body: clearAllProcessedBody,
    query: clearAllProcessedQuery,
    params: clearAllProcessedParams,
  },
};
