import z from "zod";
declare const _default: {
    getAll: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                type: z.ZodOptional<z.ZodEnum<["pages", "singlepage"]>>;
            }, "strip", z.ZodTypeAny, {
                type?: "pages" | "singlepage" | undefined;
            }, {
                type?: "pages" | "singlepage" | undefined;
            }>>;
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["bricks"]>, "many">>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                type?: "pages" | "singlepage" | undefined;
            } | undefined;
            include?: "bricks"[] | undefined;
        }, {
            filter?: {
                type?: "pages" | "singlepage" | undefined;
            } | undefined;
            include?: "bricks"[] | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            collection_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            collection_key: string;
        }, {
            collection_key: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=collections.d.ts.map