declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{
            form_key: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            form_key: string;
        }, {
            form_key: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        form_key: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        form_key: string;
    }, {
        form_key: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=get-single.d.ts.map