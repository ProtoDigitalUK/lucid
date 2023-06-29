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
};
