import z from "zod";
declare const _default: {
    createSingle: {
        body: z.ZodObject<{
            collection_key: z.ZodString;
            title: z.ZodString;
            slug: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            collection_key: string;
            slug: string;
            description?: string | undefined;
        }, {
            title: string;
            collection_key: string;
            slug: string;
            description?: string | undefined;
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
                collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                title: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
            }, {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["title", "created_at"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "asc" | "desc";
                key: "title" | "created_at";
            }, {
                value: "asc" | "desc";
                key: "title" | "created_at";
            }>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                collection_key?: string | string[] | undefined;
                title?: string | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
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
                value: "asc" | "desc";
                key: "title" | "created_at";
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
    updateSingle: {
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title?: string | undefined;
            slug?: string | undefined;
            description?: string | undefined;
        }, {
            title?: string | undefined;
            slug?: string | undefined;
            description?: string | undefined;
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
};
export default _default;
//# sourceMappingURL=categories.d.ts.map