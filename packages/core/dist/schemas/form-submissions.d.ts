import z from "zod";
declare const _default: {
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
            form_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            form_key: string;
        }, {
            id: string;
            form_key: string;
        }>;
    };
    getMultiple: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["created_at", "updated_at", "read_at"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "asc" | "desc";
                key: "created_at" | "updated_at" | "read_at";
            }, {
                value: "asc" | "desc";
                key: "created_at" | "updated_at" | "read_at";
            }>, "many">>;
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            sort?: {
                value: "asc" | "desc";
                key: "created_at" | "updated_at" | "read_at";
            }[] | undefined;
            include?: "fields"[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            sort?: {
                value: "asc" | "desc";
                key: "created_at" | "updated_at" | "read_at";
            }[] | undefined;
            include?: "fields"[] | undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{
            form_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            form_key: string;
        }, {
            form_key: string;
        }>;
    };
    toggleReadAt: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
            form_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            form_key: string;
        }, {
            id: string;
            form_key: string;
        }>;
    };
    deleteSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
            form_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            form_key: string;
        }, {
            id: string;
            form_key: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=form-submissions.d.ts.map