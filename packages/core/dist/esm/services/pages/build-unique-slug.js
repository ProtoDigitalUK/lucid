import slug from "slug";
import Page from "../../db/models/Page.js";
const buildUniqueSlug = async (client, data) => {
    if (data.homepage) {
        return "/";
    }
    data.slug = slug(data.slug, { lower: true });
    const slugCount = await Page.getSlugCount(client, {
        slug: data.slug,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        parent_id: data.parent_id,
    });
    if (slugCount >= 1) {
        return `${data.slug}-${slugCount}`;
    }
    else {
        return data.slug;
    }
};
export default buildUniqueSlug;
//# sourceMappingURL=build-unique-slug.js.map