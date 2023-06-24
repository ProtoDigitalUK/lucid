import BrickData, { BrickObject } from "../models/BrickData";
type SinglePageGetSingle = (data: {
    environment_key: string;
    collection_key: string;
}) => Promise<SinglePageT>;
type SinglePageUpdateSingle = (data: {
    userId: number;
    environment_key: string;
    collection_key: string;
    builder_bricks?: Array<BrickObject>;
    fixed_bricks?: Array<BrickObject>;
}) => Promise<SinglePageT>;
export type SinglePageT = {
    id: number;
    environment_key: string;
    collection_key: string;
    builder_bricks?: Array<BrickData> | null;
    fixed_bricks?: Array<BrickData> | null;
    created_at: string;
    updated_at: string;
    updated_by: string;
};
export default class SinglePage {
    #private;
    static getSingle: SinglePageGetSingle;
    static updateSingle: SinglePageUpdateSingle;
}
export {};
//# sourceMappingURL=SinglePage.d.ts.map