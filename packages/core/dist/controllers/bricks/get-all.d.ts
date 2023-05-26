import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
            filter: z.ZodOptional<z.ZodObject<{
                s: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                s: string;
            }, {
                s: string;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["name"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "desc" | "asc";
                key: "name";
            }, {
                value: "desc" | "asc";
                key: "name";
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            include?: "fields"[] | undefined;
            filter?: {
                s: string;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "name";
            }[] | undefined;
        }, {
            include?: "fields"[] | undefined;
            filter?: {
                s: string;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "name";
            }[] | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
        filter: z.ZodOptional<z.ZodObject<{
            s: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            s: string;
        }, {
            s: string;
        }>>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodEnum<["name"]>;
            value: z.ZodEnum<["asc", "desc"]>;
        }, "strip", z.ZodTypeAny, {
            value: "desc" | "asc";
            key: "name";
        }, {
            value: "desc" | "asc";
            key: "name";
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        include?: "fields"[] | undefined;
        filter?: {
            s: string;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "name";
        }[] | undefined;
    }, {
        include?: "fields"[] | undefined;
        filter?: {
            s: string;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "name";
        }[] | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map