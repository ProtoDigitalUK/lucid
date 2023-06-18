import z from "zod";
declare const _default: {
    updateSingle: {
        body: z.ZodObject<{
            bricks: z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodNumber>;
                key: z.ZodString;
                fields: z.ZodOptional<z.ZodArray<z.ZodType<{
                    type: import("../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, z.ZodTypeDef, {
                    type: import("../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            bricks: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    type: import("../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[];
        }, {
            bricks: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    type: import("../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[];
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
//# sourceMappingURL=groups.d.ts.map