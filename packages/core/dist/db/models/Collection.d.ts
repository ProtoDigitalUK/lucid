import z from "zod";
import { EnvironmentT } from "../models/Environment";
import { BrickObject } from "../models/CollectionBrick";
import collectionSchema from "../../schemas/collections";
import { CollectionConfigT, CollectionBuilderT } from "@lucid/collection-builder";
import { EnvironmentResT } from "../../services/environments/format-environment";
type CollectionGetAll = (query: z.infer<typeof collectionSchema.getAll.query>, environment_key: string) => Promise<CollectionT[]>;
type CollectionGetSingle = (props: {
    collection_key: CollectionConfigT["key"];
    environment_key: string;
    type?: CollectionConfigT["type"];
    environment?: EnvironmentT;
}) => Promise<CollectionT>;
type CollectionUpdateBricks = (props: {
    id: number;
    builder_bricks: Array<BrickObject>;
    fixed_bricks: Array<BrickObject>;
    collection: CollectionT;
    environment: EnvironmentResT;
}) => Promise<void>;
export type CollectionT = {
    key: CollectionConfigT["key"];
    title: CollectionConfigT["title"];
    singular: CollectionConfigT["singular"];
    description: CollectionConfigT["description"];
    type: CollectionConfigT["type"];
    bricks?: CollectionConfigT["bricks"];
};
export default class Collection {
    #private;
    static getAll: CollectionGetAll;
    static getSingle: CollectionGetSingle;
    static updateBricks: CollectionUpdateBricks;
    static getCollectionsConfig: () => CollectionBuilderT[];
    static getCollectionData: (instance: CollectionBuilderT) => CollectionT;
}
export {};
//# sourceMappingURL=Collection.d.ts.map