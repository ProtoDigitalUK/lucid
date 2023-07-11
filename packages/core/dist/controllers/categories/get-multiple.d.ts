declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                collection_key: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
                title: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
            }, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
            }>>;
            sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                key: import("zod").ZodEnum<["title", "created_at"]>;
                value: import("zod").ZodEnum<["asc", "desc"]>;
            }, "strip", import("zod").ZodTypeAny, {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }, {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }>, "many">>;
            page: import("zod").ZodOptional<import("zod").ZodString>;
            per_page: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            filter?: {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "title" | "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            collection_key: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
            title: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
        }, {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
        }>>;
        sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            key: import("zod").ZodEnum<["title", "created_at"]>;
            value: import("zod").ZodEnum<["asc", "desc"]>;
        }, "strip", import("zod").ZodTypeAny, {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }, {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }>, "many">>;
        page: import("zod").ZodOptional<import("zod").ZodString>;
        per_page: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        filter?: {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }, {
        filter?: {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "title" | "created_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map