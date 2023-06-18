declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            assigned_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            assigned_collections: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
        }, {
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{
            key: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        key: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        key: string;
    }, {
        key: string;
    }>, import("zod").ZodObject<{
        assigned_bricks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        assigned_collections: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        assigned_bricks?: string[] | undefined;
        assigned_collections?: string[] | undefined;
    }, {
        assigned_bricks?: string[] | undefined;
        assigned_collections?: string[] | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-single.d.ts.map