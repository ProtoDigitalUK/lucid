import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["bricks"]>, "many">>;
        }, "strip", z.ZodTypeAny, {
            include?: "bricks"[] | undefined;
        }, {
            include?: "bricks"[] | undefined;
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
        include: z.ZodOptional<z.ZodArray<z.ZodEnum<["bricks"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        include?: "bricks"[] | undefined;
    }, {
        include?: "bricks"[] | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-single.d.ts.map