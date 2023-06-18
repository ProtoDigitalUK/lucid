import z from "zod";
import { CollectionBuilderT } from "@lucid/collection-builder";
import collectionSchema from "../../schemas/collections";
type CollectionGetAll = (query: z.infer<typeof collectionSchema.getAll.query>) => Promise<CollectionT[]>;
type CollectionVerifyType = (key: string, type: string, environment_key: string) => Promise<CollectionT>;
export type CollectionT = {
    key: string;
    title: string;
    singular: string;
    description: string | null;
    type: "pages" | "group";
    bricks: Array<string>;
};
export default class Collection {
    #private;
    static getAll: CollectionGetAll;
    static getSingle: CollectionVerifyType;
    static getCollectionsConfig: () => CollectionBuilderT[];
    static getCollectionData: (instance: CollectionBuilderT) => CollectionT;
}
export {};
//# sourceMappingURL=Collection.d.ts.map