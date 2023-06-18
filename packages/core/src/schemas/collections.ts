import z from "zod";

// ------------------------------------
// GET ALL
const getAllBody = z.object({});
const getAllQuery = z.object({
  filter: z
    .object({
      type: z.enum(["pages", "group"]).optional(),
      environment_key: z.string().optional(),
    })
    .optional(),
});
const getAllParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  getAll: {
    body: getAllBody,
    query: getAllQuery,
    params: getAllParams,
  },
};
