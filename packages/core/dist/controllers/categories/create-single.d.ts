declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            collection_key: import("zod").ZodString;
            title: import("zod").ZodString;
            slug: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            title: string;
            collection_key: string;
            slug: string;
            description?: string | undefined;
        }, {
            title: string;
            collection_key: string;
            slug: string;
            description?: string | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        collection_key: import("zod").ZodString;
        title: import("zod").ZodString;
        slug: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        title: string;
        collection_key: string;
        slug: string;
        description?: string | undefined;
    }, {
        title: string;
        collection_key: string;
        slug: string;
        description?: string | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map