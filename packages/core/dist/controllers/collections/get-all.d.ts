import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<["single", "multiple"]>;
            }, "strip", z.ZodTypeAny, {
                type: "single" | "multiple";
            }, {
                type: "single" | "multiple";
            }>>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                type: "single" | "multiple";
            } | undefined;
        }, {
            filter?: {
                type: "single" | "multiple";
            } | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        filter: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<["single", "multiple"]>;
        }, "strip", z.ZodTypeAny, {
            type: "single" | "multiple";
        }, {
            type: "single" | "multiple";
        }>>;
    }, "strip", z.ZodTypeAny, {
        filter?: {
            type: "single" | "multiple";
        } | undefined;
    }, {
        filter?: {
            type: "single" | "multiple";
        } | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map