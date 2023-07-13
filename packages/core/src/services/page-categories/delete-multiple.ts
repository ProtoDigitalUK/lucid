// Utils
import { LucidError } from "@utils/app/error-handler";
// Models
import PageCategory from "@db/models/PageCategory";

export interface ServiceData {
  page_id: number;
  category_ids: Array<number>;
}

const deleteMultiple = async (data: ServiceData) => {
  const pageCategory = await PageCategory.deleteMultiple({
    page_id: data.page_id,
    category_ids: data.category_ids,
  });

  if (pageCategory.length !== data.category_ids.length) {
    throw new LucidError({
      type: "basic",
      name: "Page Category Not Deleted",
      message: "There was an error deleting the page category.",
      status: 500,
    });
  }

  return pageCategory;
};

export default deleteMultiple;
