import { PoolClient } from "pg";
import { BrickObject } from "../models/CollectionBrick.js";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import { BrickResT } from "../../utils/format/format-bricks.js";
type SinglePageGetSingle = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<SinglePageT>;
type SinglePageCreateSingle = (client: PoolClient, data: {
    user_id: number;
    environment_key: string;
    collection_key: string;
    builder_bricks?: Array<BrickObject>;
    fixed_bricks?: Array<BrickObject>;
}) => Promise<SinglePageT>;
type SinglePageUpdateSingle = (client: PoolClient, data: {
    id: number;
    user_id: number;
}) => Promise<SinglePageT>;
export type SinglePageT = {
    id: number;
    environment_key: string;
    collection_key: string;
    builder_bricks?: Array<BrickResT> | null;
    fixed_bricks?: Array<BrickResT> | null;
    created_at: string;
    updated_at: string;
    updated_by: string;
};
export default class SinglePage {
    static getSingle: SinglePageGetSingle;
    static createSingle: SinglePageCreateSingle;
    static updateSingle: SinglePageUpdateSingle;
}
export {};
//# sourceMappingURL=SinglePage.d.ts.map