declare const _default: {
    updateMultiple: (data: import("./update-multiple").ServiceData) => Promise<void>;
    upsertSingle: (data: import("./upsert-single").ServiceData) => Promise<number>;
    upsertRepeater: (data: import("./upsert-repeater").ServiceData) => Promise<void>;
    checkFieldExists: (data: import("./check-field-exists").ServiceData) => Promise<void>;
    upsertField: (data: import("./upsert-field").ServiceData) => Promise<number>;
    getAll: (data: import("./get-all").ServiceData) => Promise<{
        builder_bricks: import("../../utils/format/format-bricks").BrickResT[];
        fixed_bricks: import("../../utils/format/format-bricks").BrickResT[];
    }>;
    deleteUnused: (data: import("./delete-unused").ServiceData) => Promise<void>;
    validateBricks: (data: {
        builder_bricks: {
            key: string;
            id?: number | undefined;
            fields?: ({
                key: string;
                type: import("../../../../brick-builder/src").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("../../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[];
        fixed_bricks: {
            key: string;
            id?: number | undefined;
            fields?: ({
                key: string;
                type: import("../../../../brick-builder/src").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("../../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[];
        collection: import("../../utils/format/format-collections").CollectionResT;
        environment: import("../../db/models/Environment").EnvironmentT;
    }) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map