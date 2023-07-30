import z from "zod";

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  form_key: z.string(),
});

// ------------------------------------
// GET ALL
const getAllBody = z.object({});
const getAllQuery = z.object({
  include: z.array(z.enum(["fields"])).optional(),
  filter: z
    .object({
      environment_key: z.string().optional(),
    })
    .optional(),
});
const getAllParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery,
    params: getSingleParams,
  },
  getAll: {
    body: getAllBody,
    query: getAllQuery,
    params: getAllParams,
  },
};
