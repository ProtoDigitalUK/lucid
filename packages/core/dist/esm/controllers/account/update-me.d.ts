declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            first_name: import("zod").ZodOptional<import("zod").ZodString>;
            last_name: import("zod").ZodOptional<import("zod").ZodString>;
            username: import("zod").ZodOptional<import("zod").ZodString>;
            email: import("zod").ZodOptional<import("zod").ZodString>;
            role_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            first_name?: string | undefined;
            last_name?: string | undefined;
            username?: string | undefined;
            email?: string | undefined;
            role_ids?: number[] | undefined;
        }, {
            first_name?: string | undefined;
            last_name?: string | undefined;
            username?: string | undefined;
            email?: string | undefined;
            role_ids?: number[] | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        first_name: import("zod").ZodOptional<import("zod").ZodString>;
        last_name: import("zod").ZodOptional<import("zod").ZodString>;
        username: import("zod").ZodOptional<import("zod").ZodString>;
        email: import("zod").ZodOptional<import("zod").ZodString>;
        role_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        first_name?: string | undefined;
        last_name?: string | undefined;
        username?: string | undefined;
        email?: string | undefined;
        role_ids?: number[] | undefined;
    }, {
        first_name?: string | undefined;
        last_name?: string | undefined;
        username?: string | undefined;
        email?: string | undefined;
        role_ids?: number[] | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-me.d.ts.map