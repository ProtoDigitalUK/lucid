import z from "zod";

interface BuildSchemaProps {
  body: Record<string, z.ZodTypeAny>;
  filter: Record<string, z.ZodTypeAny>;
  params: Record<string, z.ZodTypeAny>;
}

const buildSchema = ({ body, filter, params }: BuildSchemaProps) => {
  return {
    body: z.object(body),
    query: {
      include: z.string().optional(),
      exclude: z.string().optional(),
      filter: z.object(filter).optional(),
      sort: z.string().optional(),
    },
    params: z.object(params),
  };
};

export default buildSchema;
