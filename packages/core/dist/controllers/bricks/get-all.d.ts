import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
            filter: z.ZodOptional<z.ZodObject<{
                s: z.ZodOptional<z.ZodString>;
                collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                environment_key: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            }, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["name"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "asc" | "desc";
                key: "name";
            }, {
                value: "asc" | "desc";
                key: "name";
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            include?: "fields"[] | undefined;
            filter?: {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "name";
            }[] | undefined;
        }, {
            include?: "fields"[] | undefined;
            filter?: {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
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
            environment_key: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
            environment_key?: string | undefined;
        }, {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
            environment_key?: string | undefined;
        }>>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodEnum<["name"]>;
            value: z.ZodEnum<["asc", "desc"]>;
        }, "strip", z.ZodTypeAny, {
            value: "asc" | "desc";
            key: "name";
        }, {
            value: "asc" | "desc";
            key: "name";
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        include?: "fields"[] | undefined;
        filter?: {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
            environment_key?: string | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "name";
        }[] | undefined;
    }, {
        include?: "fields"[] | undefined;
        filter?: {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
            environment_key?: string | undefined;
        } | undefined;
        sort?: {
            value: "asc" | "desc";
            key: "name";
        }[] | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map