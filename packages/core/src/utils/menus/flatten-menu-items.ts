// Services
import { MenuItem } from "@schemas/menus";

const flattenMenuItems = (items: MenuItem[]) => {
  const flattenedItems: MenuItem[] = [];
  items.forEach((item) => {
    const children = [...(item.children || [])];
    delete item.children;
    flattenedItems.push(item);
    if (children.length > 0) {
      flattenMenuItems(children);
    }
  });
  return flattenedItems;
};

export default flattenMenuItems;
