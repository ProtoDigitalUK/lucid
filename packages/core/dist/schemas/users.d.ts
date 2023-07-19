import z from "zod";
declare const _default: {
    updateSingle: {
        body: z.ZodObject<{
            role_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            role_ids?: number[] | undefined;
        }, {
            role_ids?: number[] | undefined;
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
    createSingle: {
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
            role_ids: number[];
            password: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }, {
            email: string;
            username: string;
            role_ids: number[];
            password: string;
            first_name?: string | undefined;
            last_name?: string | undefined;
            super_admin?: boolean | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    deleteSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    getMultiple: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                first_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                email: z.ZodOptional<z.ZodString>;
                username: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                last_name?: string | undefined;
                email?: string | undefined;
                username?: string | undefined;
            }, {
                first_name?: string | undefined;
                last_name?: string | undefined;
                email?: string | undefined;
                username?: string | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["created_at"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "desc" | "asc";
                key: "created_at";
            }, {
                value: "desc" | "asc";
                key: "created_at";
            }>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                first_name?: string | undefined;
                last_name?: string | undefined;
                email?: string | undefined;
                username?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                first_name?: string | undefined;
                last_name?: string | undefined;
                email?: string | undefined;
                username?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=users.d.ts.map