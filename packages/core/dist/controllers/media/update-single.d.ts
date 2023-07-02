declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            name: import("zod").ZodOptional<import("zod").ZodString>;
            alt: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            name?: string | undefined;
            alt?: string | undefined;
        }, {
            name?: string | undefined;
            alt?: string | undefined;
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{
            key: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        key: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        key: string;
    }, {
        key: string;
    }>, import("zod").ZodObject<{
        name: import("zod").ZodOptional<import("zod").ZodString>;
        alt: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        name?: string | undefined;
        alt?: string | undefined;
    }, {
        name?: string | undefined;
        alt?: string | undefined;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-single.d.ts.map