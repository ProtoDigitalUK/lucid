import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{
            collection_key: z.ZodString;
            title: z.ZodString;
            slug: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            collection_key: string;
            title: string;
            slug: string;
            description?: string | undefined;
        }, {
            collection_key: string;
            title: string;
            slug: string;
            description?: string | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        collection_key: z.ZodString;
        title: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        collection_key: string;
        title: string;
        slug: string;
        description?: string | undefined;
    }, {
        collection_key: string;
        title: string;
        slug: string;
        description?: string | undefined;
    }>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map