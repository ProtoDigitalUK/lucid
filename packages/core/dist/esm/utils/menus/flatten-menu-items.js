const flattenMenuItems = (items) => {
    const flattenedItems = [];
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
//# sourceMappingURL=flatten-menu-items.js.map