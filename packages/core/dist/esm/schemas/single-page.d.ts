import z from "zod";
declare const _default: {
    updateSingle: {
        body: z.ZodObject<{
            builder_bricks: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodNumber>;
                key: z.ZodString;
                fields: z.ZodOptional<z.ZodArray<z.ZodType<{
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, z.ZodTypeDef, {
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }>, "many">>;
            }, "strip", z.ZodTypeAny, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">>;
            fixed_bricks: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodNumber>;
                key: z.ZodString;
                fields: z.ZodOptional<z.ZodArray<z.ZodType<{
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, z.ZodTypeDef, {
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }>, "many">>;
            }, "strip", z.ZodTypeAny, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            builder_bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
            fixed_bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
        }, {
            builder_bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
            fixed_bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../builders/brick-builder/types.js").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            collection_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            collection_key: string;
        }, {
            collection_key: string;
        }>;
    };
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            collection_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            collection_key: string;
        }, {
            collection_key: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=single-page.d.ts.map