declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
            filter: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodObject<{
                collection_key: import("zod").ZodOptional<import("zod").ZodString>;
                environment_key: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                collection_key?: string | undefined;
                environment_key?: string | undefined;
            }, {
                collection_key?: string | undefined;
                environment_key?: string | undefined;
            }>>, {
                collection_key?: string | undefined;
                environment_key?: string | undefined;
            } | undefined, {
                collection_key?: string | undefined;
                environment_key?: string | undefined;
            } | undefined>;
        }, "strip", import("zod").ZodTypeAny, {
            include?: "fields"[] | undefined;
            filter?: {
                collection_key?: string | undefined;
                environment_key?: string | undefined;
            } | undefined;
        }, {
            include?: "fields"[] | undefined;
            filter?: {
                collection_key?: string | undefined;
                environment_key?: string | undefined;
            } | undefined;
        }>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
        filter: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodObject<{
            collection_key: import("zod").ZodOptional<import("zod").ZodString>;
            environment_key: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        }, {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        }>>, {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        } | undefined, {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        } | undefined>;
    }, "strip", import("zod").ZodTypeAny, {
        include?: "fields"[] | undefined;
        filter?: {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        } | undefined;
    }, {
        include?: "fields"[] | undefined;
        filter?: {
            collection_key?: string | undefined;
            environment_key?: string | undefined;
        } | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map