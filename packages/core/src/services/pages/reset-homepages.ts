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

const resetHomepages = async (data: ServiceData) => {
  const homepages = await Page.getNonCurrentHomepages(
    data.current,
    data.environment_key
  );

  const updatePromises = homepages.map(async (homepage) => {
    let newSlug = slugify(homepage.title, { lower: true, strict: true });
    const slugExists = await Page.checkSlugExistence(
      newSlug,
      homepage.id,
      data.environment_key
    );

    if (slugExists) {
      newSlug += `-${homepage.id}`;
    }

    return Page.updatePageToNonHomepage(homepage.id, newSlug);
  });

  await Promise.all(updatePromises);
};

export default resetHomepages;
