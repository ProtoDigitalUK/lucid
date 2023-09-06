declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            email: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            email: string;
        }, {
            email: string;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        email: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=send-reset-password.d.ts.map