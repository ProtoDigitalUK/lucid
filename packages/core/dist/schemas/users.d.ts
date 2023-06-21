import z from "zod";
declare const _default: {
    updateSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    updateRoles: {
        body: z.ZodObject<{
            role_ids: z.ZodArray<z.ZodNumber, "many">;
        }, "strip", z.ZodTypeAny, {
            role_ids: number[];
        }, {
            role_ids: number[];
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=users.d.ts.map