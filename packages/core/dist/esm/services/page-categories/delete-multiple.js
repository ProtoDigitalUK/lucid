import { LucidError } from "../../utils/app/error-handler.js";
import PageCategory from "../../db/models/PageCategory.js";
const deleteMultiple = async (client, data) => {
    const pageCategory = await PageCategory.deleteMultiple(client, {
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
//# sourceMappingURL=delete-multiple.js.map