import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Page from "../../db/models/Page.js";
import collectionsService from "../collections/index.js";
import collectionBricksService from "../collection-bricks/index.js";
import formatPage from "../../utils/format/format-page.js";
const getSingle = async (client, data) => {
    const { include } = data.query;
    const SelectQuery = new SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
            "collection_key",
            "parent_id",
            "title",
            "slug",
            "full_slug",
            "homepage",
            "excerpt",
            "published",
            "published_at",
            "published_by",
            "created_by",
            "created_at",
            "updated_at",
        ],
        exclude: undefined,
        filter: {
            data: {
                id: data.id.toString(),
                environment_key: data.environment_key,
            },
            meta: {
                id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: undefined,
        page: undefined,
        per_page: undefined,
    });
    const page = await Page.getSingle(client, SelectQuery);
    if (!page) {
        throw new LucidError({
            type: "basic",
            name: "Page not found",
            message: `Page with id "${data.id}" not found`,
            status: 404,
        });
    }
    if (include && include.includes("bricks")) {
        const collection = await service(collectionsService.getSingle, false, client)({
            collection_key: page.collection_key,
            environment_key: page.environment_key,
            type: "pages",
        });
        const pageBricks = await service(collectionBricksService.getAll, false, client)({
            reference_id: page.id,
            type: "pages",
            environment_key: data.environment_key,
            collection: collection,
        });
        page.builder_bricks = pageBricks.builder_bricks;
        page.fixed_bricks = pageBricks.fixed_bricks;
    }
    return formatPage(page);
};
export default getSingle;
//# sourceMappingURL=get-single.js.map