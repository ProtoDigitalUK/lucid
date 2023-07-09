import z from "zod";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";

export interface ServiceData {
  query: z.infer<typeof pagesSchema.getSingle.query>;
  environment_key: string;
  id: number;
}

const getSingle = async (data: ServiceData) => {
  const page = await Page.getSingle(data.query, {
    environment_key: data.environment_key,
    id: data.id,
  });
  return page;
};

export default getSingle;
