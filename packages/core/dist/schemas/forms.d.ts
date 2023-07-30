import z from "zod";
declare const _default: {
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            form_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            form_key: string;
        }, {
            form_key: string;
        }>;
    };
    getAll: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
            filter: z.ZodOptional<z.ZodObject<{
                environment_key: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                environment_key?: string | undefined;
            }, {
                environment_key?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            include?: "fields"[] | undefined;
            filter?: {
                environment_key?: string | undefined;
            } | undefined;
        }, {
            include?: "fields"[] | undefined;
            filter?: {
                environment_key?: string | undefined;
            } | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
};
export default _default;
//# sourceMappingURL=forms.d.ts.map