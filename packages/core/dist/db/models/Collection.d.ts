import { CollectionBuilderT } from "@lucid/collection-builder";
interface QueryParams extends ModelQueryParams {
    filter?: {
        type?: string;
    };
}
type CollectionGetAll = (query: QueryParams) => Promise<CollectionT[]>;
type CollectionVerifyType = (key: string, type: string) => Promise<boolean>;
export type CollectionT = {
    key: string;
    title: string;
    singular: string;
    description: string | null;
    type: "single" | "multiple";
    bricks: Array<string>;
};
export default class Collection {
    #private;
    static getAll: CollectionGetAll;
    static findCollection: CollectionVerifyType;
    static getCollectionsConfig: () => CollectionBuilderT[];
    static getCollectionData: (instance: CollectionBuilderT) => CollectionT;
}
export {};
//# sourceMappingURL=Collection.d.ts.map