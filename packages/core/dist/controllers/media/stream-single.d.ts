declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            width: import("zod").ZodOptional<import("zod").ZodString>;
            height: import("zod").ZodOptional<import("zod").ZodString>;
            format: import("zod").ZodOptional<import("zod").ZodEnum<["jpeg", "png", "webp", "avif"]>>;
            fallback: import("zod").ZodOptional<import("zod").ZodEnum<["1", "0"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            width?: string | undefined;
            height?: string | undefined;
            format?: "jpeg" | "png" | "webp" | "avif" | undefined;
            fallback?: "1" | "0" | undefined;
        }, {
            width?: string | undefined;
            height?: string | undefined;
            format?: "jpeg" | "png" | "webp" | "avif" | undefined;
            fallback?: "1" | "0" | undefined;
        }>;
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
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        width: import("zod").ZodOptional<import("zod").ZodString>;
        height: import("zod").ZodOptional<import("zod").ZodString>;
        format: import("zod").ZodOptional<import("zod").ZodEnum<["jpeg", "png", "webp", "avif"]>>;
        fallback: import("zod").ZodOptional<import("zod").ZodEnum<["1", "0"]>>;
    }, "strip", import("zod").ZodTypeAny, {
        width?: string | undefined;
        height?: string | undefined;
        format?: "jpeg" | "png" | "webp" | "avif" | undefined;
        fallback?: "1" | "0" | undefined;
    }, {
        width?: string | undefined;
        height?: string | undefined;
        format?: "jpeg" | "png" | "webp" | "avif" | undefined;
        fallback?: "1" | "0" | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=stream-single.d.ts.map