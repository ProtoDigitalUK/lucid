import z from "zod";
// Models
import Menu from "@db/models/Menu";
// Schema
import menusSchema from "@schemas/menus";

interface ServiceData {
  query: z.infer<typeof menusSchema.getMultiple.query>;
  environment_key: string;
}

const getMultiple = async (data: ServiceData) => {
  const menus = await Menu.getMultiple(data.query, {
    environment_key: data.environment_key,
  });

  return menus;
};

export default getMultiple;
