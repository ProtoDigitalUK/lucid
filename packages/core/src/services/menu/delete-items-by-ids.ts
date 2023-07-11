// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import Menu from "@db/models/Menu";

export interface ServiceData {
  ids: number[];
}

const deleteItemsByIds = async (data: ServiceData) => {
  const deletedItems = await Menu.deleteItemsByIds(data.ids);

  if (deletedItems.length !== data.ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Menu Item Delete Error",
      message: "Menu items could not be deleted",
      status: 500,
    });
  }

  return deletedItems;
};

export default deleteItemsByIds;