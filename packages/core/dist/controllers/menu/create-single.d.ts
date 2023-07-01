declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            key: import("zod").ZodString;
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            items: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<import("../../schemas/menus").MenuItem, import("zod").ZodTypeDef, import("../../schemas/menus").MenuItem>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            name: string;
            key: string;
            description?: string | undefined;
            items?: import("../../schemas/menus").MenuItem[] | undefined;
        }, {
            name: string;
            key: string;
            description?: string | undefined;
            items?: import("../../schemas/menus").MenuItem[] | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        key: import("zod").ZodString;
        name: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        items: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodType<import("../../schemas/menus").MenuItem, import("zod").ZodTypeDef, import("../../schemas/menus").MenuItem>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        name: string;
        key: string;
        description?: string | undefined;
        items?: import("../../schemas/menus").MenuItem[] | undefined;
    }, {
        name: string;
        key: string;
        description?: string | undefined;
        items?: import("../../schemas/menus").MenuItem[] | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map