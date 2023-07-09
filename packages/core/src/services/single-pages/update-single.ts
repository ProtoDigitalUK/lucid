import z from "zod";
// Models
import SinglePage from "@db/models/SinglePage";
// Schema
import { BrickSchema } from "@schemas/bricks";

interface ServiceData {
  environment_key: string;
  collection_key: string;
  userId: number;
  builder_bricks?: z.infer<typeof BrickSchema>[];
  fixed_bricks?: z.infer<typeof BrickSchema>[];
}

const updateSingle = async (data: ServiceData) => {
  const singlepage = await SinglePage.updateSingle({
    userId: data.userId,
    environment_key: data.environment_key,
    collection_key: data.collection_key,
    builder_bricks: data.builder_bricks,
    fixed_bricks: data.fixed_bricks,
  });
  return singlepage;
};

export default updateSingle;
