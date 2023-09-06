import service from "../../utils/app/service.js";
import PageCategory from "../../db/models/PageCategory.js";
import pageCategoryService from "../page-categories/index.js";
const updateMultiple = async (client, data) => {
    const pageCategoriesRes = await PageCategory.getMultipleByPageId(client, {
        page_id: data.page_id,
    });
    const categoriesToAdd = data.category_ids.filter((id) => !pageCategoriesRes.find((pageCategory) => pageCategory.category_id === id));
    const categoriesToRemove = pageCategoriesRes.filter((pageCategory) => !data.category_ids.includes(pageCategory.category_id));
    const updatePromise = [];
    if (categoriesToAdd.length > 0) {
        updatePromise.push(service(pageCategoryService.createMultiple, false, client)({
            page_id: data.page_id,
            category_ids: categoriesToAdd,
            collection_key: data.collection_key,
        }));
    }
    if (categoriesToRemove.length > 0) {
        updatePromise.push(service(pageCategoryService.deleteMultiple, false, client)({
            page_id: data.page_id,
            category_ids: categoriesToRemove.map((category) => category.category_id),
        }));
    }
    const updateRes = await Promise.all(updatePromise);
    const newPageCategories = pageCategoriesRes.filter((pageCategory) => !categoriesToRemove.includes(pageCategory));
    if (categoriesToAdd.length > 0) {
        newPageCategories.push(...updateRes[0]);
    }
    return newPageCategories;
};
export default updateMultiple;
//# sourceMappingURL=update-multiple.js.map