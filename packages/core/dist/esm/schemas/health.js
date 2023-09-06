import z from "zod";
const getHealthBody = z.object({});
const getHealthQuery = z.object({});
const getHealthParams = z.object({});
export default {
    getHealth: {
        body: getHealthBody,
        query: getHealthQuery,
        params: getHealthParams,
    },
};
//# sourceMappingURL=health.js.map