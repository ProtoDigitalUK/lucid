import z from "zod";
import { BrickSchema } from "./bricks.js";
const updateSingleBody = z.object({
    builder_bricks: z.array(BrickSchema).optional(),
    fixed_bricks: z.array(BrickSchema).optional(),
});
const updateSingleQuery = z.object({});
const updateSingleParams = z.object({
    collection_key: z.string(),
});
const getSingleBody = z.object({});
const getSingleQuery = z.object({});
const getSingleParams = z.object({
    collection_key: z.string(),
});
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
//# sourceMappingURL=single-page.js.map