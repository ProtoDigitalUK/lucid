declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            username: import("zod").ZodString;
            password: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            username: string;
            password: string;
        }, {
            username: string;
            password: string;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        username: import("zod").ZodString;
        password: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        username: string;
        password: string;
    }, {
        username: string;
        password: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=login.d.ts.map