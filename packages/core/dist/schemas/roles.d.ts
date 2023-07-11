import z from "zod";
declare const _default: {
    createSingle: {
        body: z.ZodObject<{
            name: z.ZodString;
            permission_groups: z.ZodArray<z.ZodObject<{
                environment_key: z.ZodOptional<z.ZodString>;
                permissions: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                permissions: string[];
                environment_key?: string | undefined;
            }, {
                permissions: string[];
                environment_key?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
        }, {
            name: string;
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    updateSingle: {
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            permission_groups: z.ZodArray<z.ZodObject<{
                environment_key: z.ZodOptional<z.ZodString>;
                permissions: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                permissions: string[];
                environment_key?: string | undefined;
            }, {
                permissions: string[];
                environment_key?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
            name?: string | undefined;
        }, {
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
            name?: string | undefined;
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
                name: z.ZodOptional<z.ZodString>;
                role_ids: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            }, "strip", z.ZodTypeAny, {
                name?: string | undefined;
                role_ids?: string | string[] | undefined;
            }, {
                name?: string | undefined;
                role_ids?: string | string[] | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["created_at", "name"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "desc" | "asc";
                key: "name" | "created_at";
            }, {
                value: "desc" | "asc";
                key: "name" | "created_at";
            }>, "many">>;
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["permissions"]>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                name?: string | undefined;
                role_ids?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "name" | "created_at";
            }[] | undefined;
            include?: "permissions"[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                name?: string | undefined;
                role_ids?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "name" | "created_at";
            }[] | undefined;
            include?: "permissions"[] | undefined;
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
//# sourceMappingURL=roles.d.ts.map