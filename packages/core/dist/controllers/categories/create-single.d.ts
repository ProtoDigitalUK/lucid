import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{
            post_type_id: z.ZodNumber;
            title: z.ZodString;
            slug: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            post_type_id: number;
            slug: string;
            description?: string | undefined;
        }, {
            title: string;
            post_type_id: number;
            slug: string;
            description?: string | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        post_type_id: z.ZodNumber;
        title: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        post_type_id: number;
        slug: string;
        description?: string | undefined;
    }, {
        title: string;
        post_type_id: number;
        slug: string;
        description?: string | undefined;
    }>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map