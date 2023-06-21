declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            role_ids: import("zod").ZodArray<import("zod").ZodNumber, "many">;
        }, "strip", import("zod").ZodTypeAny, {
            role_ids: number[];
        }, {
            role_ids: number[];
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
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
    }>, import("zod").ZodObject<{
        role_ids: import("zod").ZodArray<import("zod").ZodNumber, "many">;
    }, "strip", import("zod").ZodTypeAny, {
        role_ids: number[];
    }, {
        role_ids: number[];
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-roles.d.ts.map