import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Page from "../../db/models/Page.js";
import pageServices from "../pages/index.js";
import formatPage from "../../utils/format/format-page.js";
const deleteSingle = async (client, data) => {
    await service(pageServices.checkPageExists, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
    const page = await Page.deleteSingle(client, {
        id: data.id,
    });
    if (!page) {
        throw new LucidError({
            type: "basic",
            name: "Page Not Deleted",
            message: "There was an error deleting the page",
            status: 500,
        });
    }
    return formatPage(page);
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map