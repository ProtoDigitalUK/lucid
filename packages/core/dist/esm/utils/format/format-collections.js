const formatCollection = (instance) => {
    return {
        key: instance.key,
        title: instance.config.title,
        singular: instance.config.singular,
        description: instance.config.description || null,
        type: instance.config.type,
        bricks: instance.config.bricks,
    };
};
export default formatCollection;
//# sourceMappingURL=format-collections.js.map