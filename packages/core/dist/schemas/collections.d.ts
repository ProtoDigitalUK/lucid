import z from "zod";
declare const _default: {
    getAll: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            filter: z.ZodOptional<z.ZodObject<{
                type: z.ZodOptional<z.ZodEnum<["pages", "group"]>>;
                environment_key: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            }, {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            filter?: {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            } | undefined;
        }, {
            filter?: {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            } | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
};
export default _default;
//# sourceMappingURL=collections.d.ts.map