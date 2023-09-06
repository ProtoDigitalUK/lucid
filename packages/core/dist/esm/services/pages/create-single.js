import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Page from "../../db/models/Page.js";
import collectionsService from "../collections/index.js";
import pageServices from "../pages/index.js";
import pageCategoryService from "../page-categories/index.js";
import formatPage from "../../utils/format/format-page.js";
const createSingle = async (client, data) => {
    const parentId = data.homepage ? undefined : data.parent_id;
    const checks = Promise.all([
        service(collectionsService.getSingle, false, client)({
            collection_key: data.collection_key,
            environment_key: data.environment_key,
            type: "pages",
        }),
        parentId === undefined
            ? Promise.resolve(undefined)
            : service(pageServices.parentChecks, false, client)({
                parent_id: parentId,
                environment_key: data.environment_key,
                collection_key: data.collection_key,
            }),
    ]);
    await checks;
    const slug = await service(pageServices.buildUniqueSlug, false, client)({
        slug: data.slug,
        homepage: data.homepage || false,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        parent_id: parentId,
    });
    const page = await Page.createSingle(client, {
        environment_key: data.environment_key,
        title: data.title,
        slug: slug,
        collection_key: data.collection_key,
        homepage: data.homepage,
        excerpt: data.excerpt,
        published: data.published,
        parent_id: parentId,
        category_ids: data.category_ids,
        userId: data.userId,
    });
    if (!page) {
        throw new LucidError({
            type: "basic",
            name: "Page Not Created",
            message: "There was an error creating the page",
            status: 500,
        });
    }
    const operations = [
        data.category_ids
            ? service(pageCategoryService.createMultiple, false, client)({
                page_id: page.id,
                category_ids: data.category_ids,
                collection_key: data.collection_key,
            })
            : Promise.resolve(),
        data.homepage
            ? service(pageServices.resetHomepages, false, client)({
                current: page.id,
                environment_key: data.environment_key,
            })
            : Promise.resolve(),
    ];
    await Promise.all(operations);
    return formatPage(page);
};
export default createSingle;
//# sourceMappingURL=create-single.js.map