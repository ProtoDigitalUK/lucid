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
};
