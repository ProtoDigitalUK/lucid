import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import pageServices from "../pages/index.js";
const parentChecks = async (client, data) => {
    const parent = await service(pageServices.checkPageExists, false, client)({
        id: data.parent_id,
        environment_key: data.environment_key,
    });
    if (parent.homepage) {
        throw new LucidError({
            type: "basic",
            name: "Homepage Parent",
            message: "The homepage cannot be set as a parent!",
            status: 400,
        });
    }
    if (parent.collection_key !== data.collection_key) {
        throw new LucidError({
            type: "basic",
            name: "Parent Collection Mismatch",
            message: "The parent page must be in the same collection as the page you are creating!",
            status: 400,
        });
    }
    return parent;
};
export default parentChecks;
//# sourceMappingURL=parent-checks.js.map