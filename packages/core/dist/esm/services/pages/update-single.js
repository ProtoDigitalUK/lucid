import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Page from "../../db/models/Page.js";
import collectionsService from "../collections/index.js";
import environmentsService from "../environments/index.js";
import collectionBricksService from "../collection-bricks/index.js";
import pageCategoryService from "../page-categories/index.js";
import pageServices from "../pages/index.js";
import formatPage from "../../utils/format/format-page.js";
const updateSingle = async (client, data) => {
    const currentPage = await service(pageServices.checkPageExists, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
    const [environment, collection] = await Promise.all([
        service(environmentsService.getSingle, false, client)({
            key: data.environment_key,
        }),
        service(collectionsService.getSingle, false, client)({
            collection_key: currentPage.collection_key,
            environment_key: data.environment_key,
            type: "pages",
        }),
    ]);
    const parentId = data.homepage ? undefined : data.parent_id;
    if (parentId) {
        await service(pageServices.parentChecks, false, client)({
            parent_id: parentId,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
        });
    }
    await service(collectionBricksService.validateBricks, false, client)({
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    let newSlug = undefined;
    if (data.slug) {
        newSlug = await service(pageServices.buildUniqueSlug, false, client)({
            slug: data.slug,
            homepage: data.homepage || false,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
            parent_id: parentId,
        });
    }
    const page = await Page.updateSingle(client, {
        id: data.id,
        environment_key: data.environment_key,
        userId: data.userId,
        title: data.title,
        slug: newSlug,
        homepage: data.homepage,
        parent_id: parentId,
        category_ids: data.category_ids,
        published: data.published,
        excerpt: data.excerpt,
        builder_bricks: data.builder_bricks,
        fixed_bricks: data.fixed_bricks,
    });
    if (!page) {
        throw new LucidError({
            type: "basic",
            name: "Page Not Updated",
            message: "There was an error updating the page",
            status: 500,
        });
    }
    await Promise.all([
        data.category_ids
            ? service(pageCategoryService.updateMultiple, false, client)({
                page_id: page.id,
                category_ids: data.category_ids,
                collection_key: currentPage.collection_key,
            })
            : Promise.resolve(),
        service(collectionBricksService.updateMultiple, false, client)({
            id: page.id,
            builder_bricks: data.builder_bricks || [],
            fixed_bricks: data.fixed_bricks || [],
            collection: collection,
            environment: environment,
        }),
    ]);
    return formatPage(page);
};
export default updateSingle;
//# sourceMappingURL=update-single.js.map