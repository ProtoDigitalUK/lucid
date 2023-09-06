import z from "zod";
const getSettingsQuery = z.object({});
const getSettingsParams = z.object({});
const getSettingsBody = z.object({});
export default {
    getSettings: {
        body: getSettingsBody,
        query: getSettingsQuery,
        params: getSettingsParams,
    },
};
//# sourceMappingURL=settings.js.map