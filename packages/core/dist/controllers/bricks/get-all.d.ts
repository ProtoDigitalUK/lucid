import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
            filter: z.ZodOptional<z.ZodObject<{
                s: z.ZodOptional<z.ZodString>;
                collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
            }, "strip", z.ZodTypeAny, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
            }, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
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
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
            } | undefined;
            sort?: {
                value: "desc" | "asc";
                key: "name";
            }[] | undefined;
        }, {
            include?: "fields"[] | undefined;
            filter?: {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
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
            s: z.ZodOptional<z.ZodString>;
            collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
        }, {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
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
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "name";
        }[] | undefined;
    }, {
        include?: "fields"[] | undefined;
        filter?: {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
        } | undefined;
        sort?: {
            value: "desc" | "asc";
            key: "name";
        }[] | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map