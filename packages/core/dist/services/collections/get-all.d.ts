import z from "zod";
import collectionSchema from "../../schemas/collections";
import { CollectionT } from "../collections";
export interface ServiceData {
    query: z.infer<typeof collectionSchema.getAll.query>;
    environment_key: string;
}
declare const getAll: (data: ServiceData) => Promise<CollectionT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map