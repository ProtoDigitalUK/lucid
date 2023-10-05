import z from "zod";
// Schema
import { BrickSchema } from "@schemas/bricks.js";

// ------------------------------------
// UPDATE SINGLE
const updateSingleBody = z.object({
  bricks: z.array(BrickSchema),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
  collection_key: z.string(),
});

// ------------------------------------
// GET SINGLE
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
  collection_key: z.string(),
});

// ------------------------------------
// EXPORT
export default {
  updateSingle: {
    body: updateSingleBody,
    query: updateSingleQuery,
    params: updateSingleParams,
  },
  getSingle: {
    body: getSingleBody,
    query: getSingleQuery,
    params: getSingleParams,
  },
};
