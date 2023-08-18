declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            title: import("zod").ZodOptional<import("zod").ZodString>;
            slug: import("zod").ZodOptional<import("zod").ZodString>;
            homepage: import("zod").ZodOptional<import("zod").ZodBoolean>;
            parent_id: import("zod").ZodOptional<import("zod").ZodNumber>;
            category_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber, "many">>;
            published: import("zod").ZodOptional<import("zod").ZodBoolean>;
            excerpt: import("zod").ZodOptional<import("zod").ZodString>;
            builder_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                id: import("zod").ZodOptional<import("zod").ZodNumber>;
                key: import("zod").ZodString;
                fields: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<{
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, import("zod").ZodTypeDef, {
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }>, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
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
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">>;
            fixed_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                id: import("zod").ZodOptional<import("zod").ZodNumber>;
                key: import("zod").ZodString;
                fields: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<{
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, import("zod").ZodTypeDef, {
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }>, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
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
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
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
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
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
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
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
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
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
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        key: string;
                        type: import("@lucid/brick-builder").FieldTypesEnum;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{
            id: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        id: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>, import("zod").ZodObject<{
        title: import("zod").ZodOptional<import("zod").ZodString>;
        slug: import("zod").ZodOptional<import("zod").ZodString>;
        homepage: import("zod").ZodOptional<import("zod").ZodBoolean>;
        parent_id: import("zod").ZodOptional<import("zod").ZodNumber>;
        category_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber, "many">>;
        published: import("zod").ZodOptional<import("zod").ZodBoolean>;
        excerpt: import("zod").ZodOptional<import("zod").ZodString>;
        builder_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            id: import("zod").ZodOptional<import("zod").ZodNumber>;
            key: import("zod").ZodString;
            fields: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<{
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }, import("zod").ZodTypeDef, {
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            key: string;
            id?: number | undefined;
            fields?: ({
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
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
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }>, "many">>;
        fixed_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            id: import("zod").ZodOptional<import("zod").ZodNumber>;
            key: import("zod").ZodString;
            fields: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<{
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }, import("zod").ZodTypeDef, {
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            key: string;
            id?: number | undefined;
            fields?: ({
                key: string;
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
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
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
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
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
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
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
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
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
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
                type: import("@lucid/brick-builder").FieldTypesEnum;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    key: string;
                    type: import("@lucid/brick-builder").FieldTypesEnum;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[] | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-single.d.ts.map