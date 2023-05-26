import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodArray<z.ZodEnum<["fields"]>, "many">;
            exclude: z.ZodUndefined;
            filter: z.ZodObject<{
                s: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                s: string;
            }, {
                s: string;
            }>;
            sort: z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["id", "name"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "desc" | "asc";
                key: "name" | "id";
            }, {
                value: "desc" | "asc";
                key: "name" | "id";
            }>, "many">;
            page: z.ZodOptional<z.ZodString>;
            per_page: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            sort: {
                value: "desc" | "asc";
                key: "name" | "id";
            }[];
            filter: {
                s: string;
            };
            include: "fields"[];
            exclude?: undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }, {
            sort: {
                value: "desc" | "asc";
                key: "name" | "id";
            }[];
            filter: {
                s: string;
            };
            include: "fields"[];
            exclude?: undefined;
            page?: string | undefined;
            per_page?: string | undefined;
        }>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    controller: Controller<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
        include: z.ZodArray<z.ZodEnum<["fields"]>, "many">;
        exclude: z.ZodUndefined;
        filter: z.ZodObject<{
            s: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            s: string;
        }, {
            s: string;
        }>;
        sort: z.ZodArray<z.ZodObject<{
            key: z.ZodEnum<["id", "name"]>;
            value: z.ZodEnum<["asc", "desc"]>;
        }, "strip", z.ZodTypeAny, {
            value: "desc" | "asc";
            key: "name" | "id";
        }, {
            value: "desc" | "asc";
            key: "name" | "id";
        }>, "many">;
        page: z.ZodOptional<z.ZodString>;
        per_page: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sort: {
            value: "desc" | "asc";
            key: "name" | "id";
        }[];
        filter: {
            s: string;
        };
        include: "fields"[];
        exclude?: undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }, {
        sort: {
            value: "desc" | "asc";
            key: "name" | "id";
        }[];
        filter: {
            s: string;
        };
        include: "fields"[];
        exclude?: undefined;
        page?: string | undefined;
        per_page?: string | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=query-example.d.ts.map