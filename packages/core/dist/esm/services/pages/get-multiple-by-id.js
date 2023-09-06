import Page from "../../db/models/Page.js";
import formatPage from "../../utils/format/format-page.js";
const getMultipleById = async (client, data) => {
    const pages = await Page.getMultipleByIds(client, {
        ids: data.ids,
        environment_key: data.environment_key,
    });
    return pages.map((page) => formatPage(page));
};
export default getMultipleById;
//# sourceMappingURL=get-multiple-by-id.js.map