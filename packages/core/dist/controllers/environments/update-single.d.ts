import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{
            assigned_bricks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            assigned_collections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
        }, {
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
        }>;
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
    }>, z.ZodObject<{
        assigned_bricks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        assigned_collections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        assigned_bricks?: string[] | undefined;
        assigned_collections?: string[] | undefined;
    }, {
        assigned_bricks?: string[] | undefined;
        assigned_collections?: string[] | undefined;
    }>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-single.d.ts.map