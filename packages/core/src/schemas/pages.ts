import z from "zod";
// Schema
import { BrickSchema } from "@schemas/bricks.js";

// ------------------------------------
// GET MULTIPLE
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
  filter: z
    .object({
      collection_key: z.union([z.string(), z.array(z.string())]).optional(),
      title: z.string().optional(),
      slug: z.string().optional(),
      category_id: z.union([z.string(), z.array(z.string())]).optional(),
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
// CREATE SINGLE
const createSingleBody = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).toLowerCase(),
  collection_key: z.string(),
  homepage: z.boolean().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  parent_id: z.number().optional(),
  category_ids: z.array(z.number()).optional(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({
  include: z.array(z.enum(["bricks"])).optional(),
});
const getSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// UPDATE SINGLE
const updateSingleBody = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  homepage: z.boolean().optional(),
  parent_id: z.number().nullable().optional(),
  category_ids: z.array(z.number()).optional(),
  published: z.boolean().optional(),
  excerpt: z.string().optional(),
  builder_bricks: z.array(BrickSchema).optional(),
  fixed_bricks: z.array(BrickSchema).optional(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
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
// DELETE MULTIPLE
const deleteMultipleBody = z.object({
  ids: z.array(z.number()),
});
const deleteMultipleQuery = z.object({});
const deleteMultipleParams = z.object({});

// ------------------------------------
// GET ALL VALID PARENTS
const getMultipleValidParentsBody = z.object({});
const getMultipleValidParentsQuery = z.object({
  filter: z
    .object({
      collection_key: z.union([z.string(), z.array(z.string())]).optional(),
      title: z.string().optional(),
    })
    .optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const getMultipleValidParentsParams = z.object({
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
  createSingle: {
    body: createSingleBody,
    query: createSingleQuery,
    params: createSingleParams,
  },
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery,
    params: getSingleParams,
  },
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams,
  },
  deleteSingle: {
    body: deleteSingleBody,
    query: deleteSingleQuery,
    params: deleteSingleParams,
  },
  deleteMultiple: {
    body: deleteMultipleBody,
    query: deleteMultipleQuery,
    params: deleteMultipleParams,
  },
  getMultipleValidParents: {
    body: getMultipleValidParentsBody,
    query: getMultipleValidParentsQuery,
    params: getMultipleValidParentsParams,
  },
};
