declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                name: import("zod").ZodOptional<import("zod").ZodString>;
                role_ids: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
            }, "strip", import("zod").ZodTypeAny, {
                name?: string | undefined;
                role_ids?: string | string[] | undefined;
            }, {
                name?: string | undefined;
                role_ids?: string | string[] | undefined;
            }>>;
            sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                key: import("zod").ZodEnum<["created_at", "name"]>;
                value: import("zod").ZodEnum<["asc", "desc"]>;
            }, "strip", import("zod").ZodTypeAny, {
                value: "desc" | "asc";
                key: "name" | "created_at";
            }, {
                value: "desc" | "asc";
                key: "name" | "created_at";
            }>, "many">>;
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["permissions"]>, "many">>;
            page: import("zod").ZodOptional<import("zod").ZodString>;
            per_page: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
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
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            name: import("zod").ZodOptional<import("zod").ZodString>;
            role_ids: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
        }, "strip", import("zod").ZodTypeAny, {
            name?: string | undefined;
            role_ids?: string | string[] | undefined;
        }, {
            name?: string | undefined;
            role_ids?: string | string[] | undefined;
        }>>;
        sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            key: import("zod").ZodEnum<["created_at", "name"]>;
            value: import("zod").ZodEnum<["asc", "desc"]>;
        }, "strip", import("zod").ZodTypeAny, {
            value: "desc" | "asc";
            key: "name" | "created_at";
        }, {
            value: "desc" | "asc";
            key: "name" | "created_at";
        }>, "many">>;
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["permissions"]>, "many">>;
        page: import("zod").ZodOptional<import("zod").ZodString>;
        per_page: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
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
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map