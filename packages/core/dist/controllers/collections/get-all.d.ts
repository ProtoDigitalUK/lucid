import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                type: z.ZodEnum<["pages", "group"]>;
            }, "strip", z.ZodTypeAny, {
                type: "group" | "pages";
            }, {
                type: "group" | "pages";
            }>>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                type: "group" | "pages";
            } | undefined;
        }, {
            filter?: {
                type: "group" | "pages";
            } | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        filter: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<["pages", "group"]>;
        }, "strip", z.ZodTypeAny, {
            type: "group" | "pages";
        }, {
            type: "group" | "pages";
        }>>;
    }, "strip", z.ZodTypeAny, {
        filter?: {
            type: "group" | "pages";
        } | undefined;
    }, {
        filter?: {
            type: "group" | "pages";
        } | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map