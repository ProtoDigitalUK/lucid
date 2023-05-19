import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodString>;
            exclude: z.ZodOptional<z.ZodString>;
            filter: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                active: z.ZodOptional<z.ZodEnum<["1", "-1"]>>;
            }, "strip", z.ZodTypeAny, {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            }, {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            include?: string | undefined;
            exclude?: string | undefined;
            filter?: {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            } | undefined;
            sort?: string | undefined;
        }, {
            include?: string | undefined;
            exclude?: string | undefined;
            filter?: {
                id?: string | undefined;
                active?: "1" | "-1" | undefined;
            } | undefined;
            sort?: string | undefined;
        }>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    controller: Controller<z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        include: z.ZodOptional<z.ZodString>;
        exclude: z.ZodOptional<z.ZodString>;
        filter: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            active: z.ZodOptional<z.ZodEnum<["1", "-1"]>>;
        }, "strip", z.ZodTypeAny, {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        }, {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        }>>;
        sort: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        include?: string | undefined;
        exclude?: string | undefined;
        filter?: {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        } | undefined;
        sort?: string | undefined;
    }, {
        include?: string | undefined;
        exclude?: string | undefined;
        filter?: {
            id?: string | undefined;
            active?: "1" | "-1" | undefined;
        } | undefined;
        sort?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-single.d.ts.map