import z from "zod";
import { FieldTypesEnum } from "../builders/brick-builder/index.js";
declare const baseFieldSchema: z.ZodObject<{
    fields_id: z.ZodOptional<z.ZodNumber>;
    parent_repeater: z.ZodOptional<z.ZodNumber>;
    group_position: z.ZodOptional<z.ZodNumber>;
    key: z.ZodString;
    type: z.ZodNativeEnum<typeof FieldTypesEnum>;
    value: z.ZodAny;
    target: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    key: string;
    type: FieldTypesEnum;
    fields_id?: number | undefined;
    parent_repeater?: number | undefined;
    group_position?: number | undefined;
    value?: any;
    target?: any;
}, {
    key: string;
    type: FieldTypesEnum;
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
    config: {
        getAll: {
            body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            query: z.ZodObject<{
                include: z.ZodOptional<z.ZodArray<z.ZodEnum<["fields"]>, "many">>;
                filter: z.ZodEffects<z.ZodOptional<z.ZodObject<{
                    collection_key: z.ZodOptional<z.ZodString>;
                    environment_key: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    collection_key?: string | undefined;
                    environment_key?: string | undefined;
                }, {
                    collection_key?: string | undefined;
                    environment_key?: string | undefined;
                }>>, {
                    collection_key?: string | undefined;
                    environment_key?: string | undefined;
                } | undefined, {
                    collection_key?: string | undefined;
                    environment_key?: string | undefined;
                } | undefined>;
            }, "strip", z.ZodTypeAny, {
                include?: "fields"[] | undefined;
                filter?: {
                    collection_key?: string | undefined;
                    environment_key?: string | undefined;
                } | undefined;
            }, {
                include?: "fields"[] | undefined;
                filter?: {
                    collection_key?: string | undefined;
                    environment_key?: string | undefined;
                } | undefined;
            }>;
            params: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        };
        getSingle: {
            body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            params: z.ZodObject<{
                brick_key: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                brick_key: string;
            }, {
                brick_key: string;
            }>;
        };
    };
};
export default _default;
//# sourceMappingURL=bricks.d.ts.map