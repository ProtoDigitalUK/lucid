declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                s: import("zod").ZodOptional<import("zod").ZodString>;
                collection_key: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
                environment_key: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            }, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            }>>;
            sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                key: import("zod").ZodEnum<["name"]>;
                value: import("zod").ZodEnum<["asc", "desc"]>;
            }, "strip", import("zod").ZodTypeAny, {
                value: "asc" | "desc";
                key: "name";
            }, {
                value: "asc" | "desc";
                key: "name";
            }>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
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
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            s: import("zod").ZodOptional<import("zod").ZodString>;
            collection_key: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString, "many">]>>;
            environment_key: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
            environment_key?: string | undefined;
        }, {
            s?: string | undefined;
            collection_key?: string | string[] | undefined;
            environment_key?: string | undefined;
        }>>;
        sort: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            key: import("zod").ZodEnum<["name"]>;
            value: import("zod").ZodEnum<["asc", "desc"]>;
        }, "strip", import("zod").ZodTypeAny, {
            value: "asc" | "desc";
            key: "name";
        }, {
            value: "asc" | "desc";
            key: "name";
        }>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
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