declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            filter: import("zod").ZodOptional<import("zod").ZodObject<{
                type: import("zod").ZodOptional<import("zod").ZodEnum<["pages", "singlepage"]>>;
                environment_key: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                type?: "pages" | "singlepage" | undefined;
                environment_key?: string | undefined;
            }, {
                type?: "pages" | "singlepage" | undefined;
                environment_key?: string | undefined;
            }>>;
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["bricks"]>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            filter?: {
                type?: "pages" | "singlepage" | undefined;
                environment_key?: string | undefined;
            } | undefined;
            include?: "bricks"[] | undefined;
        }, {
            filter?: {
                type?: "pages" | "singlepage" | undefined;
                environment_key?: string | undefined;
            } | undefined;
            include?: "bricks"[] | undefined;
        }>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        filter: import("zod").ZodOptional<import("zod").ZodObject<{
            type: import("zod").ZodOptional<import("zod").ZodEnum<["pages", "singlepage"]>>;
            environment_key: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            type?: "pages" | "singlepage" | undefined;
            environment_key?: string | undefined;
        }, {
            type?: "pages" | "singlepage" | undefined;
            environment_key?: string | undefined;
        }>>;
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["bricks"]>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        filter?: {
            type?: "pages" | "singlepage" | undefined;
            environment_key?: string | undefined;
        } | undefined;
        include?: "bricks"[] | undefined;
    }, {
        filter?: {
            type?: "pages" | "singlepage" | undefined;
            environment_key?: string | undefined;
        } | undefined;
        include?: "bricks"[] | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map