import T from "@translations/index.js";
import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Services
import collectionsService from "@services/collections/index.js";

export interface ServiceData {
  environment_key: string;
  collection_key: string;
  homepage?: boolean;
  parent_id?: number;
}

const checkPageCollection = async (client: PoolClient, data: ServiceData) => {
  const collection = await service(
    collectionsService.getSingle,
    false,
    client
  )({
    collection_key: data.collection_key,
    environment_key: data.environment_key,
    type: "pages",
  });

  if (collection.disableHomepage === true && data.homepage === true) {
    throw new HeadlessError({
      type: "basic",
      name: T("error_creating_page"),
      message: T("error_creating_page_homepage_disabled"),
      status: 500,
    });
  }

  if (collection.disableParent === true && data.parent_id !== undefined) {
    throw new HeadlessError({
      type: "basic",
      name: T("error_creating_page"),
      message: T("error_creating_page_parents_disabled"),
      status: 500,
    });
  }

  return collection;
};

export default checkPageCollection;
