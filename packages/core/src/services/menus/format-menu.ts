// Models
import { MenuT, MenuItemT } from "@db/models/Menu";

// -------------------------------------------
// Types
interface ItemsRes {
  id: number;
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
// Functions

const buildURL = (full_slug: string | null, url: string) => {
  if (full_slug) {
    if (full_slug === "/") return "/";
    return `/${full_slug}`;
  }
  return url;
};

// Recursive function to build menu items
const buildItems = (
  items: MenuItemT[],
  parent_id: number | null
): ItemsRes[] => {
  const matchedItems =
    items?.filter((item) => item.parent_id === parent_id) || [];
  return matchedItems.map((item) => ({
    id: item.id,
    page_id: item.page_id,
    name: item.name,
    url: buildURL(item.full_slug, item.url),
    target: item.target,
    meta: item.meta,
    children: buildItems(items, item.id),
  }));
};

// Format menu
const formatMenu = (menu: MenuT, items: MenuItemT[]) => {
  const menuItems = items.filter((item) => item.menu_id === menu.id);
  const nestedItems = buildItems(menuItems, null);

  return {
    id: menu.id,
    key: menu.key,
    environment_key: menu.environment_key,
    name: menu.name,
    description: menu.description,
    created_at: menu.created_at,
    updated_at: menu.updated_at,
    items: nestedItems.length ? nestedItems : null,
  };
};

export default formatMenu;
