import { PoolClient } from "pg";
import slugify from "slugify";
// Models
import Page from "@db/models/Page";

export interface ServiceData {
  current: number;
  environment_key: string;
}

/*
    Resets all homepages to false except the one being created
*/

const resetHomepages = async (client: PoolClient, data: ServiceData) => {
  const homepages = await Page.getNonCurrentHomepages(client, {
    current_id: data.current,
    environment_key: data.environment_key,
  });

  const updatePromises = homepages.map(async (homepage) => {
    let newSlug = slugify(homepage.title, { lower: true, strict: true });
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
