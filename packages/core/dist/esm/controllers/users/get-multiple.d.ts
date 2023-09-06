declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                first_name: import("zod").ZodOptional<import("zod").ZodString>;
                last_name: import("zod").ZodOptional<import("zod").ZodString>;
                email: import("zod").ZodOptional<import("zod").ZodString>;
                username: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
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
            sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                key: import("zod").ZodEnum<["created_at"]>;
                value: import("zod").ZodEnum<["asc", "desc"]>;
            }, "strip", import("zod").ZodTypeAny, {
                value: "desc" | "asc";
                key: "created_at";
            }, {
                value: "desc" | "asc";
                key: "created_at";
            }>, "many">>;
            page: import("zod").ZodOptional<import("zod").ZodString>;
            per_page: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
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
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            first_name: import("zod").ZodOptional<import("zod").ZodString>;
            last_name: import("zod").ZodOptional<import("zod").ZodString>;
            email: import("zod").ZodOptional<import("zod").ZodString>;
            username: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
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
        sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            key: import("zod").ZodEnum<["created_at"]>;
            value: import("zod").ZodEnum<["asc", "desc"]>;
        }, "strip", import("zod").ZodTypeAny, {
            value: "desc" | "asc";
            key: "created_at";
        }, {
            value: "desc" | "asc";
            key: "created_at";
        }>, "many">>;
        page: import("zod").ZodOptional<import("zod").ZodString>;
        per_page: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
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
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map