import z from "zod";
import { CollectionT } from "../models/Collection";
import { EnvironmentT } from "../models/Environment";
import { BrickBuilderT, CustomField } from "@lucid/brick-builder";
import { CollectionBrickConfigT } from "@lucid/collection-builder";
import bricksSchema from "../../schemas/bricks";
type BrickConfigIsBrickAllowed = (data: {
    key: string;
    collection: CollectionT;
    environment: EnvironmentT;
    type?: CollectionBrickConfigT["type"];
}) => {
    allowed: boolean;
    brick?: BrickConfigT;
    collectionBrick?: {
        builder?: CollectionBrickConfigT;
        fixed?: CollectionBrickConfigT;
    };
};
type BrickConfigGetAll = (query: z.infer<typeof bricksSchema.config.getAll.query>, data: {
    collection_key: string;
    environment_key: string;
}) => Promise<BrickConfigT[]>;
type BrickConfigGetSingle = (data: {
    brick_key: string;
    collection_key: string;
    environment_key: string;
}) => Promise<BrickConfigT>;
type BrickConfigGetAllAllowedBricks = (data: {
    collection: CollectionT;
    environment: EnvironmentT;
}) => {
    bricks: BrickConfigT[];
    collectionBricks: CollectionBrickConfigT[];
};
export type BrickConfigT = {
    key: string;
    title: string;
    fields?: CustomField[];
};
export default class BrickConfig {
    static getSingle: BrickConfigGetSingle;
    static getAll: BrickConfigGetAll;
    static isBrickAllowed: BrickConfigIsBrickAllowed;
    static getAllAllowedBricks: BrickConfigGetAllAllowedBricks;
    static getBrickConfig: () => BrickBuilderT[];
    static getBrickData: (instance: BrickBuilderT, query?: {
        include?: "fields"[] | undefined;
    } | undefined) => BrickConfigT;
}
export {};
//# sourceMappingURL=BrickConfig.d.ts.map