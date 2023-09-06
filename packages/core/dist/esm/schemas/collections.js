import z from "zod";
const getAllBody = z.object({});
const getAllQuery = z.object({
    filter: z
        .object({
        type: z.enum(["pages", "singlepage"]).optional(),
        environment_key: z.string().optional(),
    })
        .optional(),
    include: z.array(z.enum(["bricks"])).optional(),
});
const getAllParams = z.object({});
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
    collection_key: z.string(),
});
export default {
    getAll: {
        body: getAllBody,
        query: getAllQuery,
        params: getAllParams,
    },
    getSingle: {
        body: getSingleBody,
        query: getSingleQuery,
        params: getSingleParams,
    },
};
//# sourceMappingURL=collections.js.map