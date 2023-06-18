import z from "zod";

// ------------------------------------
// GET HEALTH
const getHealthBody = z.object({});
const getHealthQuery = z.object({});
const getHealthParams = z.object({});

// ------------------------------------
// EXPORT
export default {
  getHealth: {
    body: getHealthBody,
    query: getHealthQuery,
    params: getHealthParams,
  },
};
