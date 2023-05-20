import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodString>;
            exclude: z.ZodOptional<z.ZodString>;
            filter: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
            sort: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            include?: string | undefined;
            exclude?: string | undefined;
            filter?: {} | undefined;
            sort?: string | undefined;
        }, {
            include?: string | undefined;
            exclude?: string | undefined;
            filter?: {} | undefined;
            sort?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        include: z.ZodOptional<z.ZodString>;
        exclude: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
        sort: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        include?: string | undefined;
        exclude?: string | undefined;
        filter?: {} | undefined;
        sort?: string | undefined;
    }, {
        include?: string | undefined;
        exclude?: string | undefined;
        filter?: {} | undefined;
        sort?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=throw-error.d.ts.map