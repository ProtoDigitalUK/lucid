import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import PageCategory from "../../db/models/PageCategory.js";
import pageCategoryService from "../page-categories/index.js";
const createMultiple = async (client, data) => {
    await service(pageCategoryService.verifyCategoriesInCollection, false, client)({
        category_ids: data.category_ids,
        collection_key: data.collection_key,
    });
    const pageCategory = await PageCategory.createMultiple(client, {
        page_id: data.page_id,
        category_ids: data.category_ids,
    });
    if (pageCategory.length !== data.category_ids.length) {
        throw new LucidError({
            type: "basic",
            name: "Page Category Not Created",
            message: "There was an error creating the page category.",
            status: 500,
        });
    }
    return pageCategory;
};
export default createMultiple;
//# sourceMappingURL=create-multiple.js.map