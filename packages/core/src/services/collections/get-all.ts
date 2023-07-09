import z from "zod";
// Models
import Collection from "@db/models/Collection";
// Schema
import collectionSchema from "@schemas/collections";

interface ServiceData {
  query: z.infer<typeof collectionSchema.getAll.query>;
  environment_key: string;
}

const getAll = async (data: ServiceData) => {
  const collections = await Collection.getAll(data.query, data.environment_key);

  return collections;
};

export default getAll;
