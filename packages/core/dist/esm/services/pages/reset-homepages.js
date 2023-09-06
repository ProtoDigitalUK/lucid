import slug from "slug";
import Page from "../../db/models/Page.js";
const resetHomepages = async (client, data) => {
    const homepages = await Page.getNonCurrentHomepages(client, {
        current_id: data.current,
        environment_key: data.environment_key,
    });
    const updatePromises = homepages.map(async (homepage) => {
        let newSlug = slug(homepage.title, { lower: true });
        const slugExists = await Page.checkSlugExistence(client, {
            slug: newSlug,
            id: homepage.id,
            environment_key: data.environment_key,
        });
        if (slugExists) {
            newSlug += `-${homepage.id}`;
        }
        return Page.updatePageToNonHomepage(client, {
            id: homepage.id,
            slug: newSlug,
        });
    });
    await Promise.all(updatePromises);
};
export default resetHomepages;
//# sourceMappingURL=reset-homepages.js.map