import z from "zod";

// ------------------------------------
// GET AUTHENTICATED USER
const getSinglePublicBody = z.object({});
const getSinglePublicQuery = z.object({});
const getSinglePublicParams = z.object({
  name: z.string().regex(/^(initial_user_created)$/),
});

// ------------------------------------
// EXPORT
export default {
  getSinglePublic: {
    body: getSinglePublicBody,
    query: getSinglePublicQuery,
    params: getSinglePublicParams,
  },
};
