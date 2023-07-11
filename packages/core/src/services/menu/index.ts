// Services
import createSingle from "./create-single";
import deleteSingle from "./delete-single";
import getMultiple from "./get-multiple";
import getSingle from "./get-single";
import updateSingle from "./update-single";
import checkKeyUnique from "./check-key-unique";
import getItems from "./get-items";
import getSingleItem from "./get-single-item";
import deleteItemsByIds from "./delete-items-by-ids";
import format from "./format";
import upsertMultipleItems from "./upsert-multiple-items";
import upsertItem from "./upsert-item";

// -------------------------------------------
// Types
export interface ItemsRes {
  page_id: number | null;

  name: string;
  url: string;
  target: "_self" | "_blank" | "_parent" | "_top";
  meta: any;

  children?: ItemsRes[];
}

export interface MenuRes {
  id: number;
  key: string;
  environment_key: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;

  items: ItemsRes[] | null;
}

// -------------------------------------------
// Exports
export default {
  createSingle,
  deleteSingle,
  getMultiple,
  getSingle,
  updateSingle,
  checkKeyUnique,
  getItems,
  getSingleItem,
  deleteItemsByIds,
  format,
  upsertMultipleItems,
  upsertItem,
};
