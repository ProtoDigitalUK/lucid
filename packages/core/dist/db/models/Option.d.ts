type OptionNames = "initial_user_created";
type OptionTypes = "boolean" | "string" | "number" | "json";
type OptionValue = boolean | number | string | object | Array<any>;
type OptionGetByName = (name: OptionNames) => Promise<OptionT>;
type OptionPatchByName = (data: {
    name: OptionNames;
    value: OptionValue;
    type: OptionTypes;
    locked: boolean;
}) => Promise<OptionT>;
type OptionCreate = (data: {
    name: OptionNames;
    value: OptionValue;
    type: OptionTypes;
    locked: boolean;
}) => Promise<OptionT>;
type OptionCreateOrPatchByName = (data: {
    name: OptionNames;
    value: OptionValue;
    type: OptionTypes;
    locked: boolean;
}) => Promise<OptionT>;
export type OptionT = {
    id: string;
    option_name: OptionNames;
    option_value: OptionValue;
    type: OptionTypes;
    locked: boolean;
    created_at: string;
    updated_at: string;
};
export default class Option {
    static getByName: OptionGetByName;
    static patchByName: OptionPatchByName;
    static create: OptionCreate;
    static createOrPatch: OptionCreateOrPatchByName;
    static convertToType: (option: OptionT) => OptionT;
    static convertToString: (value: OptionValue, type: OptionTypes) => string;
}
export {};
//# sourceMappingURL=Option.d.ts.map