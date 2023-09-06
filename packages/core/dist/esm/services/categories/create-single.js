import Category from "../../db/models/Category.js";
import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import collectionsService from "../collections/index.js";
const createSingle = async (client, data) => {
    await service(collectionsService.getSingle, false, client)({
        collection_key: data.collection_key,
        type: "pages",
        environment_key: data.environment_key,
    });
    const isSlugUnique = await Category.isSlugUniqueInCollection(client, {
        collection_key: data.collection_key,
        slug: data.slug,
        environment_key: data.environment_key,
    });
    if (!isSlugUnique) {
        throw new LucidError({
            type: "basic",
            name: "Category Not Created",
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
    const category = await Category.createSingle(client, data);
    if (!category) {
        throw new LucidError({
            type: "basic",
            name: "Category Not Created",
            message: "There was an error creating the category.",
            status: 500,
        });
    }
    return category;
};
export default createSingle;
//# sourceMappingURL=create-single.js.map