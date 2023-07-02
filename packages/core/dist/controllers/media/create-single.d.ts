declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            name: import("zod").ZodOptional<import("zod").ZodString>;
            alt: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            name?: string | undefined;
            alt?: string | undefined;
        }, {
            name?: string | undefined;
            alt?: string | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        name: import("zod").ZodOptional<import("zod").ZodString>;
        alt: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        name?: string | undefined;
        alt?: string | undefined;
    }, {
        name?: string | undefined;
        alt?: string | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map