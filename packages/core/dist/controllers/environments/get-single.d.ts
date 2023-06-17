import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    controller: Controller<z.ZodObject<{
        key: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
    }, {
        key: string;
    }>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=get-single.d.ts.map