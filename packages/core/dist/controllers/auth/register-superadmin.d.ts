declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            first_name: import("zod").ZodOptional<import("zod").ZodString>;
            last_name: import("zod").ZodOptional<import("zod").ZodString>;
            email: import("zod").ZodString;
            username: import("zod").ZodString;
            password: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            email: string;
            username: string;
            password: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
        }, {
            email: string;
            username: string;
            password: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        first_name: import("zod").ZodOptional<import("zod").ZodString>;
        last_name: import("zod").ZodOptional<import("zod").ZodString>;
        email: import("zod").ZodString;
        username: import("zod").ZodString;
        password: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        email: string;
        username: string;
        password: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
    }, {
        email: string;
        username: string;
        password: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=register-superadmin.d.ts.map