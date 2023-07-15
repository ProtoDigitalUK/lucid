import z from "zod";

// ------------------------------------
// UPDATE ME
const updateMeBody = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role_ids: z.array(z.number()).optional(),
});
const updateMeQuery = z.object({});
const updateMeParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  updateMe: {
    body: updateMeBody,
    query: updateMeQuery,
    params: updateMeParams,
  },
};
