import { PoolClient } from "pg";
import z from "zod";
import collectionSchema from "../../schemas/collections";
import { CollectionResT } from "@lucid/types/src/collections";
export interface ServiceData {
    query: z.infer<typeof collectionSchema.getAll.query>;
    environment_key: string;
}
declare const getAll: (client: PoolClient, data: ServiceData) => Promise<CollectionResT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map