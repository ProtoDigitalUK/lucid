const getBrickData = (instance, query) => {
    const data = {
        key: instance.key,
        title: instance.title,
        preview: instance.config?.preview,
    };
    if (!query)
        return data;
    if (query.include?.includes("fields"))
        data.fields = instance.fieldTree;
    return data;
};
export default getBrickData;
//# sourceMappingURL=get-brick-data.js.map