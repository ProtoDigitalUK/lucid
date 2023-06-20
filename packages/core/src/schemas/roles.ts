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
// EXPORT
export default {
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
};
