import z from "zod";

// ------------------------------------
// GET ALL
const getAllBody = z.object({});
const getAllQuery = z.object({});
const getAllParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  getAll: {
    body: getAllBody,
    query: getAllQuery,
    params: getAllParams,
  },
};
