import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import PageCategory from "../../db/models/PageCategory.js";
const verifyCategoriesInCollection = async (client, data) => {
    const pageCategories = await PageCategory.getMultiple(client, {
        category_ids: data.category_ids,
        collection_key: data.collection_key,
    });
    if (pageCategories.length !== data.category_ids.length) {
        throw new LucidError({
            type: "basic",
            name: "Category Not Found",
            message: "Category not found.",
            status: 404,
            errors: modelErrors({
                id: {
                    code: "not_found",
                    message: "Category not found.",
                },
                collection_key: {
                    code: "not_found",
                    message: "Collection key not found.",
                },
            }),
        });
    }
    return pageCategories;
};
export default verifyCategoriesInCollection;
//# sourceMappingURL=verify-cateogies-in-collection.js.map