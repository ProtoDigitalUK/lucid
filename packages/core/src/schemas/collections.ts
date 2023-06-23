import z from "zod";

// ------------------------------------
// GET ALL
const getAllBody = z.object({});
const getAllQuery = z.object({
  filter: z
    .object({
      type: z.enum(["pages", "group"]).optional(),
    })
    .optional(),
  include: z.array(z.enum(["bricks"])).optional(),
});
const getAllParams = z.object({});

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  collection_key: z.string(),
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
};
