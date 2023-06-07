import { PageT } from "@db/models/Page";

const formatPage = (data: PageT) => {
  // Categories
  if (data.categories) {
    data.categories = data.categories[0] === null ? [] : data.categories;
  }
  // Full Slug
  if (data.full_slug) {
    if (!data.full_slug.startsWith("/")) {
      data.full_slug = "/" + data.full_slug;
    }
  }

  return data;
};

export default formatPage;
