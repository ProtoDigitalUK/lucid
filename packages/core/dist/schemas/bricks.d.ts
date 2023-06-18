import z from "zod";
import { FieldTypesEnum } from "@lucid/brick-builder";
declare const baseFieldSchema: z.ZodObject<{
    fields_id: z.ZodOptional<z.ZodNumber>;
    parent_repeater: z.ZodOptional<z.ZodNumber>;
    group_position: z.ZodOptional<z.ZodNumber>;
    key: z.ZodString;
    type: z.ZodNativeEnum<typeof FieldTypesEnum>;
    value: z.ZodAny;
    target: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    type: FieldTypesEnum;
    key: string;
    fields_id?: number | undefined;
    parent_repeater?: number | undefined;
    group_position?: number | undefined;
    value?: any;
    target?: any;
}, {
    type: FieldTypesEnum;
    key: string;
    fields_id?: number | undefined;
    parent_repeater?: number | undefined;
    group_position?: number | undefined;
    value?: any;
    target?: any;
}>;
type Field = z.infer<typeof baseFieldSchema> & {
    items?: Field[];
};
export declare const FieldSchema: z.ZodType<Field>;
export declare const BrickSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    key: z.ZodString;
    fields: z.ZodOptional<z.ZodArray<z.ZodType<Field, z.ZodTypeDef, Field>, "many">>;
}, "strip", z.ZodTypeAny, {
    key: string;
    id?: number | undefined;
    fields?: Field[] | undefined;
}, {
    key: string;
    id?: number | undefined;
    fields?: Field[] | undefined;
}>;
declare const _default: {
    getAll: {
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        query: z.ZodObject<{
            include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
            filter: z.ZodOptional<z.ZodObject<{
                s: z.ZodOptional<z.ZodString>;
                collection_key: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
                environment_key: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            }, {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            }>>;
            sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
                key: z.ZodEnum<["name"]>;
                value: z.ZodEnum<["asc", "desc"]>;
            }, "strip", z.ZodTypeAny, {
                value: "asc" | "desc";
                key: "name";
            }, {
                value: "asc" | "desc";
                key: "name";
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            include?: "fields"[] | undefined;
            filter?: {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "name";
            }[] | undefined;
        }, {
            include?: "fields"[] | undefined;
            filter?: {
                s?: string | undefined;
                collection_key?: string | string[] | undefined;
                environment_key?: string | undefined;
            } | undefined;
            sort?: {
                value: "asc" | "desc";
                key: "name";
            }[] | undefined;
        }>;
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
};
export default _default;
//# sourceMappingURL=bricks.d.ts.map