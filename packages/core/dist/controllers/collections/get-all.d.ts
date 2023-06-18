declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                type: import("zod").ZodOptional<import("zod").ZodEnum<["pages", "group"]>>;
                environment_key: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            }, {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            filter?: {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            } | undefined;
        }, {
            filter?: {
                type?: "pages" | "group" | undefined;
                environment_key?: string | undefined;
            } | undefined;
        }>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            type: import("zod").ZodOptional<import("zod").ZodEnum<["pages", "group"]>>;
            environment_key: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            type?: "pages" | "group" | undefined;
            environment_key?: string | undefined;
        }, {
            type?: "pages" | "group" | undefined;
            environment_key?: string | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        filter?: {
            type?: "pages" | "group" | undefined;
            environment_key?: string | undefined;
        } | undefined;
    }, {
        filter?: {
            type?: "pages" | "group" | undefined;
            environment_key?: string | undefined;
        } | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map