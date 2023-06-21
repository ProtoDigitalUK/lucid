import BrickData, { BrickObject } from "../models/BrickData";
type GroupGetSingle = (environment_key: string, collection_key: string) => Promise<GroupT>;
type GroupUpdateSingle = (userId: number, environment_key: string, collection_key: string, bricks: Array<BrickObject>) => Promise<GroupT>;
export type GroupT = {
    id: number;
    environment_key: string;
    collection_key: string;
    bricks?: Array<BrickData> | null;
    created_at: string;
    updated_at: string;
    updated_by: string;
};
export default class Group {
    #private;
    static getSingle: GroupGetSingle;
    static updateSingle: GroupUpdateSingle;
}
export {};
//# sourceMappingURL=Group.d.ts.map