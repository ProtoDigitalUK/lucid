// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Role from "@db/models/Role";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (data: ServiceData) => {
  const role = await Role.deleteSingle(data.id);

  if (!role) {
    throw new LucidError({
      type: "basic",
      name: "Role Error",
      message: "There was an error deleting the role.",
      status: 500,
    });
  }

  return role;
};

export default deleteSingle;
