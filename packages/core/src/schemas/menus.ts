import z from "zod";

// ------------------------------------
// CREATE & UPDATE BRICKS / FIELDS
const BaseMenuItemSchema = z.object({
  url: z.string().optional(),
  page_id: z.number().optional(),
  name: z.string().nonempty(),
  target: z.enum(["_self", "_blank", "_parent", "_top"]).optional(),
  meta: z.any().optional(),
});

export type MenuItem = z.infer<typeof BaseMenuItemSchema> & {
  children?: MenuItem[];
};

export const MenuItem: z.ZodType<MenuItem> = BaseMenuItemSchema.extend({
  children: z.lazy(() => MenuItem.array().optional()),
});

// ------------------------------------
// CREATE SINGLE
const createSingleBody = z.object({
  key: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  items: z.array(MenuItem).optional(),
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
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// GET MULTIPLE
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
  filter: z
    .object({
      name: z.string().optional(),
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
  include: z.array(z.enum(["items"])).optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const getMultipleParams = z.object({});

// ------------------------------------
// EXPORT
export default {
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
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery,
    params: getSingleParams,
  },
  getMultiple: {
    body: getMultipleBody,
    query: getMultipleQuery,
    params: getMultipleParams,
  },
};
