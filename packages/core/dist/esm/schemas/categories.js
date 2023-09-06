import z from "zod";
const createSingleBody = z.object({
    collection_key: z.string(),
    title: z.string(),
    slug: z.string().min(2).toLowerCase(),
    description: z.string().optional(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});
const deleteSingleBody = z.object({});
const deleteSingleQuery = z.object({});
const deleteSingleParams = z.object({
    id: z.string(),
});
const getMultipleBody = z.object({});
const getMultipleQuery = z.object({
    filter: z
        .object({
        collection_key: z.union([z.string(), z.array(z.string())]).optional(),
        title: z.string().optional(),
    })
        .optional(),
    sort: z
        .array(z.object({
        key: z.enum(["title", "created_at"]),
        value: z.enum(["asc", "desc"]),
    }))
        .optional(),
    page: z.string().optional(),
    per_page: z.string().optional(),
});
const getMultipleParams = z.object({});
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
    id: z.string(),
});
const updateSingleBody = z.object({
    title: z.string().optional(),
    slug: z.string().min(2).toLowerCase().optional(),
    description: z.string().optional(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
    id: z.string(),
});
export default {
    createSingle: {
        body: createSingleBody,
        query: createSingleQuery,
        params: createSingleParams,
    },
    deleteSingle: {
        body: deleteSingleBody,
        query: deleteSingleQuery,
        params: deleteSingleParams,
    },
    getMultiple: {
        body: getMultipleBody,
        query: getMultipleQuery,
        params: getMultipleParams,
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
};
//# sourceMappingURL=categories.js.map