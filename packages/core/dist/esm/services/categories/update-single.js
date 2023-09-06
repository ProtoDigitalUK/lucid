import service from "../../utils/app/service.js";
import Category from "../../db/models/Category.js";
import categoriesService from "../categories/index.js";
import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
const updateSingle = async (client, data) => {
    const currentCategory = await service(categoriesService.getSingle, false, client)({
        environment_key: data.environment_key,
        id: data.id,
    });
    if (data.data.slug) {
        const isSlugUnique = await Category.isSlugUniqueInCollection(client, {
            collection_key: currentCategory.collection_key,
            slug: data.data.slug,
            environment_key: data.environment_key,
            ignore_id: data.id,
        });
        if (!isSlugUnique) {
            throw new LucidError({
                type: "basic",
                name: "Category Not Updated",
                message: "Please provide a unique slug within this post type.",
                status: 400,
                errors: modelErrors({
                    slug: {
                        code: "not_unique",
                        message: "Please provide a unique slug within this post type.",
                    },
                }),
            });
        }
    }
    return await Category.updateSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
        title: data.data.title,
        slug: data.data.slug,
        description: data.data.description,
    });
};
export default updateSingle;
//# sourceMappingURL=update-single.js.map