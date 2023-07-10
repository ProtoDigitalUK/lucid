import z from "zod";
import collectionSchema from "../../schemas/collections";
import { CollectionT } from "../collections";
export interface ServiceData {
    query: z.infer<typeof collectionSchema.getAll.query>;
    environment_key: string;
}
declare const getAll: (data: ServiceData) => Promise<never[] | {
    getSingle: (data: import("./get-single").ServiceData) => Promise<CollectionT>;
    getAll: any;
    updateBricks: (data: import("./update-bricks").ServiceData) => Promise<void>;
    formatCollection: (instance: import("../../../../collection-builder/src").default) => CollectionT;
}>;
export default getAll;
//# sourceMappingURL=get-all.d.ts.map