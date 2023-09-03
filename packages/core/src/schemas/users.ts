import z from "zod";

// ------------------------------------
// UPDATE SINGLE
const updateSingleBody = z.object({
  role_ids: z.array(z.number()).optional(),
  super_admin: z.boolean().optional(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// CREATE USER
const createSingleBody = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
    role_ids: z.array(z.number()),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    super_admin: z.boolean().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// DELETE SINGLE
const deleteSingleBody = z.object({});
const deleteSingleQuery = z.object({});
const deleteSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// GET MULTIPLE
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
  filter: z
    .object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      email: z.string().optional(),
      username: z.string().optional(),
    })
    .optional(),
  sort: z
    .array(
      z.object({
        key: z.enum(["created_at"]),
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
// EXPORT
export default {
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams,
  },
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams,
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
};
