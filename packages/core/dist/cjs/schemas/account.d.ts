import z from "zod";
declare const _default: {
    updateMe: {
        body: z.ZodObject<{
            first_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            username: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            role_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
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
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
};
export default _default;
//# sourceMappingURL=account.d.ts.map