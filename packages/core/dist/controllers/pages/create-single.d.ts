import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{
            title: z.ZodString;
            slug: z.ZodString;
            post_type_id: z.ZodNumber;
            homepage: z.ZodOptional<z.ZodBoolean>;
            excerpt: z.ZodOptional<z.ZodString>;
            published: z.ZodOptional<z.ZodBoolean>;
            parent_id: z.ZodOptional<z.ZodNumber>;
            category_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            post_type_id: number;
            slug: string;
            homepage?: boolean | undefined;
            excerpt?: string | undefined;
            published?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
        }, {
            title: string;
            post_type_id: number;
            slug: string;
            homepage?: boolean | undefined;
            excerpt?: string | undefined;
            published?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        title: z.ZodString;
        slug: z.ZodString;
        post_type_id: z.ZodNumber;
        homepage: z.ZodOptional<z.ZodBoolean>;
        excerpt: z.ZodOptional<z.ZodString>;
        published: z.ZodOptional<z.ZodBoolean>;
        parent_id: z.ZodOptional<z.ZodNumber>;
        category_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        post_type_id: number;
        slug: string;
        homepage?: boolean | undefined;
        excerpt?: string | undefined;
        published?: boolean | undefined;
        parent_id?: number | undefined;
        category_ids?: number[] | undefined;
    }, {
        title: string;
        post_type_id: number;
        slug: string;
        homepage?: boolean | undefined;
        excerpt?: string | undefined;
        published?: boolean | undefined;
        parent_id?: number | undefined;
        category_ids?: number[] | undefined;
    }>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map