declare const _default: {
    schema: {
        body: import("zod").ZodEffects<import("zod").ZodObject<{
            email: import("zod").ZodString;
            username: import("zod").ZodString;
            password: import("zod").ZodString;
            password_confirmation: import("zod").ZodString;
            role_ids: import("zod").ZodArray<import("zod").ZodNumber, "many">;
            first_name: import("zod").ZodOptional<import("zod").ZodString>;
            last_name: import("zod").ZodOptional<import("zod").ZodString>;
            super_admin: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            email: string;
            username: string;
            role_ids: number[];
            password: string;
            password_confirmation: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }, {
            email: string;
            username: string;
            role_ids: number[];
            password: string;
            password_confirmation: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }>, {
            email: string;
            username: string;
            role_ids: number[];
            password: string;
            password_confirmation: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }, {
            email: string;
            username: string;
            role_ids: number[];
            password: string;
            password_confirmation: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodEffects<import("zod").ZodObject<{
        email: import("zod").ZodString;
        username: import("zod").ZodString;
        password: import("zod").ZodString;
        password_confirmation: import("zod").ZodString;
        role_ids: import("zod").ZodArray<import("zod").ZodNumber, "many">;
        first_name: import("zod").ZodOptional<import("zod").ZodString>;
        last_name: import("zod").ZodOptional<import("zod").ZodString>;
        super_admin: import("zod").ZodOptional<import("zod").ZodBoolean>;
    }, "strip", import("zod").ZodTypeAny, {
        email: string;
        username: string;
        role_ids: number[];
        password: string;
        password_confirmation: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        super_admin?: boolean | undefined;
    }, {
        email: string;
        username: string;
        role_ids: number[];
        password: string;
        password_confirmation: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        super_admin?: boolean | undefined;
    }>, {
        email: string;
        username: string;
        role_ids: number[];
        password: string;
        password_confirmation: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        super_admin?: boolean | undefined;
    }, {
        email: string;
        username: string;
        role_ids: number[];
        password: string;
        password_confirmation: string;
        first_name?: string | undefined;
        last_name?: string | undefined;
        super_admin?: boolean | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map