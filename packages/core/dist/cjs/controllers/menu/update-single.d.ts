declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            key: import("zod").ZodOptional<import("zod").ZodString>;
            name: import("zod").ZodOptional<import("zod").ZodString>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            items: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<import("../../schemas/menus.js").MenuItemUpdate, import("zod").ZodTypeDef, import("../../schemas/menus.js").MenuItemUpdate>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            key?: string | undefined;
            name?: string | undefined;
            description?: string | undefined;
            items?: import("../../schemas/menus.js").MenuItemUpdate[] | undefined;
        }, {
            key?: string | undefined;
            name?: string | undefined;
            description?: string | undefined;
            items?: import("../../schemas/menus.js").MenuItemUpdate[] | undefined;
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
        key: import("zod").ZodOptional<import("zod").ZodString>;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        items: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<import("../../schemas/menus.js").MenuItemUpdate, import("zod").ZodTypeDef, import("../../schemas/menus.js").MenuItemUpdate>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        key?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
        items?: import("../../schemas/menus.js").MenuItemUpdate[] | undefined;
    }, {
        key?: string | undefined;
        name?: string | undefined;
        description?: string | undefined;
        items?: import("../../schemas/menus.js").MenuItemUpdate[] | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-single.d.ts.map