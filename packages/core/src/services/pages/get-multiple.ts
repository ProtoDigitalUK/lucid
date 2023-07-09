import z from "zod";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";

export interface ServiceData {
  query: z.infer<typeof pagesSchema.getMultiple.query>;
  environment_key: string;
}

const getMultiple = async (data: ServiceData) => {
  const pages = await Page.getMultiple(data.query, {
    environment_key: data.environment_key,
  });

  return pages;
};

export default getMultiple;
