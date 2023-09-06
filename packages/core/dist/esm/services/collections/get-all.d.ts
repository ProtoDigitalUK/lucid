import { PoolClient } from "pg";
import z from "zod";
import collectionSchema from "../../schemas/collections.js";
import { CollectionResT } from "@lucid/types/src/collections.js";
export interface ServiceData {
    query: z.infer<typeof collectionSchema.getAll.query>;
}
declare const getAll: (client: PoolClient, data: ServiceData) => Promise<CollectionResT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map