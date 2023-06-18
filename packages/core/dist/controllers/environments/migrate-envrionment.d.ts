declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
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
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=migrate-envrionment.d.ts.map