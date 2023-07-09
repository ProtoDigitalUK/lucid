import z from "zod";
// Models
import Role from "@db/models/Role";
// Schema
import rolesSchema from "@schemas/roles";

interface ServiceData {
  query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (data: ServiceData) => {
  const roles = await Role.getMultiple(data.query);

  return roles;
};

export default getMultiple;
