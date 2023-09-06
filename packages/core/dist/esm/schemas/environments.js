import z from "zod";
const getAllBody = z.object({});
const getAllQuery = z.object({});
const getAllParams = z.object({});
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
    key: z.string(),
});
const migrateEnvironmentBody = z.object({});
const migrateEnvironmentQuery = z.object({});
const migrateEnvironmentParams = z.object({
    key: z.string(),
});
const updateSingleBody = z.object({
    title: z.string().optional(),
    assigned_bricks: z.array(z.string()).optional(),
    assigned_collections: z.array(z.string()).optional(),
    assigned_forms: z.array(z.string()).optional(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
    key: z.string(),
});
const createSingleBody = z.object({
    key: z
        .string()
        .min(4)
        .max(64)
        .refine((value) => /^[a-z-]+$/.test(value), {
        message: "Invalid key format. Only lowercase letters and dashes are allowed.",
    }),
    title: z.string(),
    assigned_bricks: z.array(z.string()).optional(),
    assigned_collections: z.array(z.string()).optional(),
    assigned_forms: z.array(z.string()).optional(),
});
const createSingleQuery = z.object({});
const createSingleParams = z.object({});
const deleteSingleBody = z.object({});
const deleteSingleQuery = z.object({});
const deleteSingleParams = z.object({
    key: z.string(),
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
    migrateEnvironment: {
        body: migrateEnvironmentBody,
        query: migrateEnvironmentQuery,
        params: migrateEnvironmentParams,
    },
    updateSingle: {
        body: updateSingleBody,
        query: updateSingleQuery,
        params: updateSingleParams,
    },
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
};
//# sourceMappingURL=environments.js.map