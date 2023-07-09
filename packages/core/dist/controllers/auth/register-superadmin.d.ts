declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            email: import("zod").ZodString;
            username: import("zod").ZodString;
            password: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            email: string;
            username: string;
            password: string;
        }, {
            email: string;
            username: string;
            password: string;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        email: import("zod").ZodString;
        username: import("zod").ZodString;
        password: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        email: string;
        username: string;
        password: string;
    }, {
        email: string;
        username: string;
        password: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=register-superadmin.d.ts.map