declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                key: import("zod").ZodEnum<["created_at", "updated_at", "read_at"]>;
                value: import("zod").ZodEnum<["asc", "desc"]>;
            }, "strip", import("zod").ZodTypeAny, {
                value: "desc" | "asc";
                key: "created_at" | "updated_at" | "read_at";
            }, {
                value: "desc" | "asc";
                key: "created_at" | "updated_at" | "read_at";
            }>, "many">>;
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
            page: import("zod").ZodOptional<import("zod").ZodString>;
            per_page: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            sort?: {
                value: "desc" | "asc";
                key: "created_at" | "updated_at" | "read_at";
            }[] | undefined;
            include?: "fields"[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            sort?: {
                value: "desc" | "asc";
                key: "created_at" | "updated_at" | "read_at";
            }[] | undefined;
            include?: "fields"[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: import("zod").ZodObject<{
            form_key: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            form_key: string;
        }, {
            form_key: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        form_key: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        form_key: string;
    }, {
        form_key: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            key: import("zod").ZodEnum<["created_at", "updated_at", "read_at"]>;
            value: import("zod").ZodEnum<["asc", "desc"]>;
        }, "strip", import("zod").ZodTypeAny, {
            value: "desc" | "asc";
            key: "created_at" | "updated_at" | "read_at";
        }, {
            value: "desc" | "asc";
            key: "created_at" | "updated_at" | "read_at";
        }>, "many">>;
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
        page: import("zod").ZodOptional<import("zod").ZodString>;
        per_page: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        sort?: {
            value: "desc" | "asc";
            key: "created_at" | "updated_at" | "read_at";
        }[] | undefined;
        include?: "fields"[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }, {
        sort?: {
            value: "desc" | "asc";
            key: "created_at" | "updated_at" | "read_at";
        }[] | undefined;
        include?: "fields"[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map