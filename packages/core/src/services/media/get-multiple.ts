import z from "zod";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";

interface ServiceData {
  query: z.infer<typeof mediaSchema.getMultiple.query>;
}

const getMultiple = async (data: ServiceData) => {
  const medias = await Media.getMultiple(data.query);

  return medias;
};

export default getMultiple;
