declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            builder_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                id: import("zod").ZodOptional<import("zod").ZodNumber>;
                key: import("zod").ZodString;
                fields: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<{
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, import("zod").ZodTypeDef, {
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, import("zod").ZodTypeDef, {
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            builder_bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
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
            collection_key: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            collection_key: string;
        }, {
            collection_key: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        collection_key: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        collection_key: string;
    }, {
        collection_key: string;
    }>, import("zod").ZodObject<{
        builder_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            id: import("zod").ZodOptional<import("zod").ZodNumber>;
            key: import("zod").ZodString;
            fields: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<{
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }, import("zod").ZodTypeDef, {
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }, import("zod").ZodTypeDef, {
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        builder_bricks?: {
            key: string;
            id?: number | undefined;
            fields?: ({
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
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
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
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