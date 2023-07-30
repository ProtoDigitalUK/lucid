declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                environment_key: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                environment_key?: string | undefined;
            }, {
                environment_key?: string | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
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
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            environment_key: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            environment_key?: string | undefined;
        }, {
            environment_key?: string | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        include?: "fields"[] | undefined;
        filter?: {
            environment_key?: string | undefined;
        } | undefined;
    }, {
        include?: "fields"[] | undefined;
        filter?: {
            environment_key?: string | undefined;
        } | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map