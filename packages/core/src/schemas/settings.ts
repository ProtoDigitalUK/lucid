import z from "zod";

// ------------------------------------
// GET SETTINGS
const getSettingsQuery = z.object({});
const getSettingsParams = z.object({});
const getSettingsBody = z.object({});

// ------------------------------------
// EXPORT
export default {
  getSettings: {
    body: getSettingsBody,
    query: getSettingsQuery,
    params: getSettingsParams,
  },
};
