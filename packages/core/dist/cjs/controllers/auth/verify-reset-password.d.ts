declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{
            token: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            token: string;
        }, {
            token: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        token: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        token: string;
    }, {
        token: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=verify-reset-password.d.ts.map