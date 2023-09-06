import Category from "../../db/models/Category.js";
import { LucidError } from "../../utils/app/error-handler.js";
const deleteSingle = async (client, data) => {
    const category = await Category.deleteSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!category) {
        throw new LucidError({
            type: "basic",
            name: "Category Not Deleted",
            message: "There was an error deleting the category.",
            status: 500,
        });
    }
    return category;
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map