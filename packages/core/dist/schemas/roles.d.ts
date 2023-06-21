import z from "zod";
declare const _default: {
    createSingle: {
        body: z.ZodObject<{
            name: z.ZodString;
            permission_groups: z.ZodArray<z.ZodObject<{
                environment_key: z.ZodOptional<z.ZodString>;
                permissions: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                permissions: string[];
                environment_key?: string | undefined;
            }, {
                permissions: string[];
                environment_key?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
        }, {
            name: string;
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    };
};
export default _default;
//# sourceMappingURL=roles.d.ts.map