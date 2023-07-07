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
        }, "strip", z.ZodTypeAny, {
            include?: "fields"[] | undefined;
        }, {
            include?: "fields"[] | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
};
export default _default;
//# sourceMappingURL=forms.d.ts.map