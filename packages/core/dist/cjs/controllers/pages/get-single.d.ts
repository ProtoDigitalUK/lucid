declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["bricks"]>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            include?: "bricks"[] | undefined;
        }, {
            include?: "bricks"[] | undefined;
        }>;
        params: import("zod").ZodObject<{
            id: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        id: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["bricks"]>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        include?: "bricks"[] | undefined;
    }, {
        include?: "bricks"[] | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-single.d.ts.map