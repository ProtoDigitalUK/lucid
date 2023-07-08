import z from "zod";
declare const _default: {
    getMultiple: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                title: z.ZodOptional<z.ZodString>;
                slug: z.ZodOptional<z.ZodString>;
                category_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            }, "strip", z.ZodTypeAny, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            }, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["created_at"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "asc" | "desc";
                key: "created_at";
            }, {
                value: "asc" | "desc";
                key: "created_at";
            }>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    createSingle: {
        body: z.ZodObject<{
            title: z.ZodString;
            slug: z.ZodString;
            collection_key: z.ZodString;
            homepage: z.ZodOptional<z.ZodBoolean>;
            excerpt: z.ZodOptional<z.ZodString>;
            published: z.ZodOptional<z.ZodBoolean>;
            parent_id: z.ZodOptional<z.ZodNumber>;
            category_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            collection_key: string;
            slug: string;
            homepage?: boolean | undefined;
            excerpt?: string | undefined;
            published?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
        }, {
            title: string;
            collection_key: string;
            slug: string;
            homepage?: boolean | undefined;
            excerpt?: string | undefined;
            published?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["bricks"]>, "many">>;
        }, "strip", z.ZodTypeAny, {
            include?: "bricks"[] | undefined;
        }, {
            include?: "bricks"[] | undefined;
        }>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    updateSingle: {
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            homepage: z.ZodOptional<z.ZodBoolean>;
            parent_id: z.ZodOptional<z.ZodNumber>;
            category_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            published: z.ZodOptional<z.ZodBoolean>;
            excerpt: z.ZodOptional<z.ZodString>;
            builder_bricks: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodNumber>;
                key: z.ZodString;
                fields: z.ZodOptional<z.ZodArray<z.ZodType<{
                    key: string;
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, z.ZodTypeDef, {
                    key: string;
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, z.ZodTypeDef, {
                    key: string;
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            title?: string | undefined;
            slug?: string | undefined;
            homepage?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
            published?: boolean | undefined;
            excerpt?: string | undefined;
            builder_bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
        }, {
            title?: string | undefined;
            slug?: string | undefined;
            homepage?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
            published?: boolean | undefined;
            excerpt?: string | undefined;
            builder_bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
                    type: import("../../../brick-builder/src").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("../../../brick-builder/src").FieldTypesEnum;
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
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    deleteSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=pages.d.ts.map