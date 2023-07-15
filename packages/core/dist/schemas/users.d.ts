import z from "zod";
declare const _default: {
    updateSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    updateRoles: {
        body: z.ZodObject<{
            role_ids: z.ZodArray<z.ZodNumber, "many">;
        }, "strip", z.ZodTypeAny, {
            role_ids: number[];
        }, {
            role_ids: number[];
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    createUser: {
        body: z.ZodObject<{
            email: z.ZodString;
            username: z.ZodString;
            password: z.ZodString;
            role_ids: z.ZodArray<z.ZodNumber, "many">;
            first_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            super_admin: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            username: string;
            password: string;
            role_ids: number[];
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }, {
            email: string;
            username: string;
            password: string;
            role_ids: number[];
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
};
export default _default;
//# sourceMappingURL=users.d.ts.map