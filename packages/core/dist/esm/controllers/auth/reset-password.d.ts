declare const _default: {
    schema: {
        body: import("zod").ZodEffects<import("zod").ZodObject<{
            password: import("zod").ZodString;
            password_confirmation: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            password: string;
            password_confirmation: string;
        }, {
            password: string;
            password_confirmation: string;
        }>, {
            password: string;
            password_confirmation: string;
        }, {
            password: string;
            password_confirmation: string;
        }>;
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
    }>, import("zod").ZodEffects<import("zod").ZodObject<{
        password: import("zod").ZodString;
        password_confirmation: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        password: string;
        password_confirmation: string;
    }, {
        password: string;
        password_confirmation: string;
    }>, {
        password: string;
        password_confirmation: string;
    }, {
        password: string;
        password_confirmation: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=reset-password.d.ts.map