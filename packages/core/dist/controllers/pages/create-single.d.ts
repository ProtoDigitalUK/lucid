declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            title: import("zod").ZodString;
            slug: import("zod").ZodString;
            collection_key: import("zod").ZodString;
            homepage: import("zod").ZodOptional<import("zod").ZodBoolean>;
            excerpt: import("zod").ZodOptional<import("zod").ZodString>;
            published: import("zod").ZodOptional<import("zod").ZodBoolean>;
            parent_id: import("zod").ZodOptional<import("zod").ZodNumber>;
            category_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
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
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        title: import("zod").ZodString;
        slug: import("zod").ZodString;
        collection_key: import("zod").ZodString;
        homepage: import("zod").ZodOptional<import("zod").ZodBoolean>;
        excerpt: import("zod").ZodOptional<import("zod").ZodString>;
        published: import("zod").ZodOptional<import("zod").ZodBoolean>;
        parent_id: import("zod").ZodOptional<import("zod").ZodNumber>;
        category_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
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
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map