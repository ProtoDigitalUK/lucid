import z from "zod";
declare const _default: {
    getAll: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
    getSingle: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    migrateEnvironment: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
    updateSingle: {
        body: z.ZodObject<{
            assigned_bricks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            assigned_collections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
        }, {
            assigned_bricks?: string[] | undefined;
            assigned_collections?: string[] | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
        }, {
            key: string;
        }>;
    };
};
export default _default;
//# sourceMappingURL=environments.d.ts.map