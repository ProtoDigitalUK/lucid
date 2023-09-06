declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            title: import("zod").ZodOptional<import("zod").ZodString>;
            slug: import("zod").ZodOptional<import("zod").ZodString>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            title?: string | undefined;
            slug?: string | undefined;
            description?: string | undefined;
        }, {
            title?: string | undefined;
            slug?: string | undefined;
            description?: string | undefined;
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
        description: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        title?: string | undefined;
        slug?: string | undefined;
        description?: string | undefined;
    }, {
        title?: string | undefined;
        slug?: string | undefined;
        description?: string | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-single.d.ts.map