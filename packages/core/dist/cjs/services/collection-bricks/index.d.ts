declare const _default: {
    updateMultiple: (client: import("pg").PoolClient, data: import("./update-multiple.js").ServiceData) => Promise<void>;
    upsertSingle: (client: import("pg").PoolClient, data: import("./upsert-single.js").ServiceData) => Promise<number>;
    upsertRepeater: (client: import("pg").PoolClient, data: import("./upsert-repeater.js").ServiceData) => Promise<void>;
    checkFieldExists: (client: import("pg").PoolClient, data: import("./check-field-exists.js").ServiceData) => Promise<void>;
    upsertField: (client: import("pg").PoolClient, data: import("./upsert-field.js").ServiceData) => Promise<number>;
    getAll: (client: import("pg").PoolClient, data: import("./get-all.js").ServiceData) => Promise<{
        builder_bricks: import("../../utils/format/format-bricks.js").BrickResT[];
        fixed_bricks: import("../../utils/format/format-bricks.js").BrickResT[];
    }>;
    deleteUnused: (client: import("pg").PoolClient, data: import("./delete-unused.js").ServiceData) => Promise<void>;
    validateBricks: (client: import("pg").PoolClient, data: {
        builder_bricks: {
            key: string;
            id?: number | undefined;
            fields?: ({
                key: string;
                type: import("../../builders/brick-builder/types.js").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("../../builders/brick-builder/types.js").FieldTypesEnum;
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
                type: import("../../builders/brick-builder/types.js").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("../../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[];
        collection: import("@lucid/types/src/collections.js").CollectionResT;
        environment: import("../../db/models/Environment.js").EnvironmentT;
    }) => Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map