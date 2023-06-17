import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                title: z.ZodOptional<z.ZodString>;
                slug: z.ZodOptional<z.ZodString>;
                category_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            }, "strip", z.ZodTypeAny, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            }, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["created_at"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "asc" | "desc";
                key: "created_at";
            }, {
                value: "asc" | "desc";
                key: "created_at";
            }>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            filter?: {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
                slug?: string | undefined;
                category_id?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "created_at";
            }[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        filter: z.ZodOptional<z.ZodObject<{
            collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            title: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            category_id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
            slug?: string | undefined;
            category_id?: string | string[] | undefined;
        }, {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
            slug?: string | undefined;
            category_id?: string | string[] | undefined;
        }>>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodEnum<["created_at"]>;
            value: z.ZodEnum<["asc", "desc"]>;
        }, "strip", z.ZodTypeAny, {
            value: "asc" | "desc";
            key: "created_at";
        }, {
            value: "asc" | "desc";
            key: "created_at";
        }>, "many">>;
        page: z.ZodOptional<z.ZodString>;
        per_page: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        filter?: {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
            slug?: string | undefined;
            category_id?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "created_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }, {
        filter?: {
            collection_key?: string | string[] | undefined;
            title?: string | undefined;
            slug?: string | undefined;
            category_id?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "created_at";
        }[] | undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-multiple.d.ts.map