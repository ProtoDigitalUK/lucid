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
  collection_key: z.string(),
  homepage: z.boolean().optional(),
  published: z.boolean().optional(),
  parent_id: z.number().optional(),
  category_ids: z.array(z.number()).optional(),
  page_content: z
    .array(
      z.object({
        language_id: z.number(),
        title: z.string().min(2),
        slug: z.string().min(2).toLowerCase(),
        excerpt: z.string().optional(),
      })
    )
    .min(1),
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
  homepage: z.boolean().optional(),
  parent_id: z.number().nullable().optional(),
  author_id: z.number().nullable().optional(),
  category_ids: z.array(z.number()).optional(),
  published: z.boolean().optional(),
  page_content: z
    .array(
      z.object({
        language_id: z.number(),
        title: z.string().min(2).optional(),
        slug: z.string().min(2).toLowerCase().optional(),
        excerpt: z.string().optional(),
      })
    )
    .optional(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
  id: z.string(),
});

// ------------------------------------
// UPDATE SINGLE BRICKS
const updateSingleBricksBody = z.object({
  bricks: z.array(BrickSchema),
});
const updateSingleBricksQuery = z.object({});
const updateSingleBricksParams = z.object({
  id: z.string(),
  collection_key: z.string(),
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
  updateSingleBricks: {
    body: updateSingleBricksBody,
    query: updateSingleBricksQuery,
    params: updateSingleBricksParams,
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
