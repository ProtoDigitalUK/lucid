import z from "zod";

// ------------------------------------
// CREATE SINGLE
const createSingleBody = z.object({
  name: z.string().optional(),
  alt: z.string().optional(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// STREAM SINGLE
const streamSingleBody = z.object({});
const streamSingleQuery = z.object({});
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
};
