import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import service from "../../utils/app/service.js";
import SinglePage from "../../db/models/SinglePage.js";
import collectionsService from "../collections/index.js";
import collectionBricksService from "../collection-bricks/index.js";
const getSingle = async (client, data) => {
    const collection = await service(collectionsService.getSingle, false, client)({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "singlepage",
    });
    const SelectQuery = new SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
            "collection_key",
            "created_at",
            "updated_at",
            "updated_by",
        ],
        exclude: undefined,
        filter: {
            data: {
                collection_key: data.collection_key,
                environment_key: data.environment_key,
            },
            meta: {
                collection_key: {
                    operator: "=",
                    type: "text",
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
    let singlepage = await SinglePage.getSingle(client, SelectQuery);
    if (!singlepage) {
        singlepage = await SinglePage.createSingle(client, {
            user_id: data.user_id,
            environment_key: data.environment_key,
            collection_key: data.collection_key,
            builder_bricks: [],
            fixed_bricks: [],
        });
    }
    if (data.include_bricks) {
        const pageBricks = await service(collectionBricksService.getAll, false, client)({
            reference_id: singlepage.id,
            type: "singlepage",
            environment_key: data.environment_key,
            collection: collection,
        });
        singlepage.builder_bricks = pageBricks.builder_bricks;
        singlepage.fixed_bricks = pageBricks.fixed_bricks;
    }
    return singlepage;
};
export default getSingle;
//# sourceMappingURL=get-single.js.map