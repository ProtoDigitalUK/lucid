import { LucidError } from "../../utils/app/error-handler.js";
import Page from "../../db/models/Page.js";
const checkPageExists = async (client, data) => {
    const page = await Page.getSingleBasic(client, {
        id: data.id,
        environment_key: data.environment_key,
    });
    if (!page) {
        throw new LucidError({
            type: "basic",
            name: "Page not found",
            message: `Page with id "${data.id}" not found in environment "${data.environment_key}"!`,
            status: 404,
        });
    }
    return page;
};
export default checkPageExists;
//# sourceMappingURL=check-page-exists.js.map