import z from "zod";

// ------------------------------------
// GET MULTIPLE
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
  filter: z
    .object({
      to_address: z.string().optional(),
      subject: z.string().optional(),
      delivery_status: z.union([z.string(), z.array(z.string())]).optional(),
      type: z.union([z.string(), z.array(z.string())]).optional(), // internal | external
      template: z.string().optional(),
    })
    .optional(),
  sort: z
    .array(
      z.object({
        key: z.enum(["created_at", "updated_at", "sent_count"]),
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
// DELETE SINGLE
const deleteSingleBody = z.object({});
const deleteSingleQuery = z.object({});
const deleteSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// RESEND SINGLE
const resendSingleBody = z.object({});
const resendSingleQuery = z.object({});
const resendSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// EXPORT
export default {
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
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams,
  },
  resendSingle: {
    body: resendSingleBody,
    query: resendSingleQuery,
    params: resendSingleParams,
  },
};
