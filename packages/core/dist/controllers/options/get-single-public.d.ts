declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{
            name: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        name: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        name: string;
    }, {
        name: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=get-single-public.d.ts.map