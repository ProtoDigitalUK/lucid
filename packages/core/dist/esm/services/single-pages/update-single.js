import service from "../../utils/app/service.js";
import SinglePage from "../../db/models/SinglePage.js";
import environmentsService from "../environments/index.js";
import collectionsService from "../collections/index.js";
import collectionBricksService from "../collection-bricks/index.js";
import singlePageService from "../single-pages/index.js";
const updateSingle = async (client, data) => {
    const environment = await service(environmentsService.getSingle, false, client)({
        key: data.environment_key,
    });
    const collection = await service(collectionsService.getSingle, false, client)({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        type: "singlepage",
    });
    const getSinglepage = await service(singlePageService.getSingle, false, client)({
        user_id: data.user_id,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
    });
    await service(collectionBricksService.validateBricks, false, client)({
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    const singlepage = await SinglePage.updateSingle(client, {
        id: getSinglepage.id,
        user_id: data.user_id,
    });
    await service(collectionBricksService.updateMultiple, false, client)({
        id: singlepage.id,
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    return await service(singlePageService.getSingle, false, client)({
        user_id: data.user_id,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        include_bricks: true,
    });
};
export default updateSingle;
//# sourceMappingURL=update-single.js.map