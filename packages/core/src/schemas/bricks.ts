import z from "zod";
import { FieldTypesEnum } from "@lucid/brick-builder";

const FieldTypesSchema = z.nativeEnum(FieldTypesEnum);

// ------------------------------------
// CREATE & UPDATE BRICKS / FIELDS
const baseFieldSchema = z.object({
  id: z.number().optional(),
  parent_repeater: z.number().optional(),
  group_position: z.number().optional(),
  key: z.string(),
  type: FieldTypesSchema,
  value: z.any(),
});

type Field = z.infer<typeof baseFieldSchema> & {
  items?: Field[];
};

export const FieldSchema: z.ZodType<Field> = baseFieldSchema.extend({
  items: z.lazy(() => FieldSchema.array().optional()),
});

export const BrickSchema = z.object({
  id: z.number().optional(),
  key: z.string(),
  fields: z.array(FieldSchema).optional(),
});
