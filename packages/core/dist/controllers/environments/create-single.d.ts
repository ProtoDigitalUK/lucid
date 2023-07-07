declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            key: import("zod").ZodString;
            title: import("zod").ZodString;
            assigned_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            assigned_collections: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            assigned_forms: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            key: string;
            title: string;
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
            assigned_forms?: string[] | undefined;
        }, {
            key: string;
            title: string;
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
            assigned_forms?: string[] | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        key: import("zod").ZodString;
        title: import("zod").ZodString;
        assigned_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        assigned_collections: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        assigned_forms: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        key: string;
        title: string;
        assigned_bricks?: string[] | undefined;
        assigned_collections?: string[] | undefined;
        assigned_forms?: string[] | undefined;
    }, {
        key: string;
        title: string;
        assigned_bricks?: string[] | undefined;
        assigned_collections?: string[] | undefined;
        assigned_forms?: string[] | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map