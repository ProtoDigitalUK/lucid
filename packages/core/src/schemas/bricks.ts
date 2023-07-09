import z from "zod";
import { FieldTypesEnum } from "@lucid/brick-builder";

const FieldTypesSchema = z.nativeEnum(FieldTypesEnum);

// ------------------------------------
// CREATE & UPDATE BRICKS / FIELDS
const baseFieldSchema = z.object({
  fields_id: z.number().optional(),
  parent_repeater: z.number().optional(),
  group_position: z.number().optional(),
  key: z.string(),
  type: FieldTypesSchema,
  value: z.any(),
  target: z.any().optional(),
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

// ------------------------------------
// GET ALL CONFIG
const getAllConfigBody = z.object({});
const getAllConfigQuery = z.object({
  include: z.array(z.enum(["fields"])).optional(),
});
const getAllConfigParams = z.object({
  collection_key: z.string().nonempty(),
});

// ------------------------------------
// GET SINGLE CONFIG
const getSingleConfigBody = z.object({});
const getSingleConfigQuery = z.object({});
const getSingleConfigParams = z.object({
  brick_key: z.string().nonempty(),
  collection_key: z.string().nonempty(),
});

// ------------------------------------
// EXPORT
export default {
  config: {
    getAll: {
      body: getAllConfigBody,
      query: getAllConfigQuery,
      params: getAllConfigParams,
    },
    getSingle: {
      body: getSingleConfigBody,
      query: getSingleConfigQuery,
      params: getSingleConfigParams,
    },
  },
};
