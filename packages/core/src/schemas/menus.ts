import z from "zod";

// ------------------------------------
// CREATE SINGLE
const createSingleBody = z.object({
  key: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        parent_id: z.number().optional(),
        url: z.string().optional(),
        page_id: z.number().optional(),
        name: z.string().nonempty(),
        target: z.enum(["_self", "_blank", "_parent", "_top"]).optional(),
        position: z.number().optional(),
        meta: z.object({}).optional(),
      })
    )
    .optional(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
};
