import { PoolClient } from "pg";
type OptionGetByName = (client: PoolClient, data: {
    name: OptionT["option_name"];
}) => Promise<OptionT>;
type OptionPatchByName = (client: PoolClient, data: {
    name: OptionT["option_name"];
    value: OptionT["option_value"];
    type: OptionT["type"];
}) => Promise<OptionT>;
export type OptionT = {
    option_name: "media_storage_used";
    option_value: boolean | number | string | object | Array<any>;
    type: "boolean" | "string" | "number" | "json";
    created_at: string;
    updated_at: string;
};
export default class Option {
    static getByName: OptionGetByName;
    static patchByName: OptionPatchByName;
}
export {};
//# sourceMappingURL=Option.d.ts.map