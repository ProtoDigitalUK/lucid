import { PoolClient } from "pg";
import slug from "slug";
// Models
import Page from "@db/models/Page.js";
import PageContent from "@db/models/PageContent.js";

export interface ServiceData {
  current: number;
  environment_key: string;
}

/*
    Resets all homepages to false except the one being created
*/

const resetHomepages = async (client: PoolClient, data: ServiceData) => {
  const homepages = await PageContent.getOldHomepages(client, {
    current_id: data.current,
    environment_key: data.environment_key,
  });

  const updatePromises = homepages.map(async (homepage) => {
    let newSlug = slug(homepage.title, { lower: true });

    const slugExists = await PageContent.checkSlugExistence(client, {
      slug: newSlug,
      id: homepage.id,
      language_id: homepage.language_id,
      environment_key: data.environment_key,
    });

    if (slugExists) {
      newSlug += `-${homepage.id}`;
    }

    return Promise.all([
      Page.updateSingleHomepageFalse(client, {
        id: homepage.page_id,
      }),
      PageContent.updateSingleSlug(client, {
        id: homepage.id,
        slug: newSlug,
      }),
    ]);
  });

  await Promise.all(updatePromises);
};

export default resetHomepages;
