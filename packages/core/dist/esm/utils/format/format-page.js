const formatPage = (data) => {
    if (data.categories) {
        data.categories = data.categories[0] === null ? [] : data.categories;
    }
    if (data.full_slug) {
        if (!data.full_slug.startsWith("/")) {
            data.full_slug = "/" + data.full_slug;
        }
    }
    return data;
};
export default formatPage;
//# sourceMappingURL=format-page.js.map