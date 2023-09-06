import z from "zod";
const getAllBody = z.object({});
const getAllQuery = z.object({});
const getAllParams = z.object({});
export default {
    getAll: {
        body: getAllBody,
        query: getAllQuery,
        params: getAllParams,
    },
};
//# sourceMappingURL=permissions.js.map