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
export {};
//# sourceMappingURL=bricks.d.ts.map