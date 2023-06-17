import { CollectionBuilderT } from "@lucid/collection-builder";
interface QueryParams extends ModelQueryParams {
    filter?: {
        type?: string;
        environment_key?: string;
        environment_collections?: Array<string>;
    };
}
type CollectionGetAll = (query: QueryParams) => Promise<CollectionT[]>;
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