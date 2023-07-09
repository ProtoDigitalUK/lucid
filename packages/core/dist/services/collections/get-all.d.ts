import z from "zod";
import collectionSchema from "../../schemas/collections";
export interface ServiceData {
    query: z.infer<typeof collectionSchema.getAll.query>;
    environment_key: string;
}
declare const getAll: (data: ServiceData) => Promise<import("../../db/models/Collection").CollectionT[]>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map